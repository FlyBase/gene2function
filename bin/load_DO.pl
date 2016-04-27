#!/usr/bin/env perl
use strict;
use warnings;
use autodie;
use 5.010;

use Getopt::Long;
use Pod::Usage;

use Search::Elasticsearch;
use Bio::OntologyIO;

my $opts = {
    help              => 0,
    man               => 0,
    debug             => 0,
    file              => '/data/doid.obo.gz',
};


GetOptions ($opts,
    'file=s',
    'debug',
    'help|?',
    'man',
);

pod2usage(1) if $opts->{help};
pod2usage(-exitstatus => 0, -verbose => 2) if $opts->{man};

=head1 NAME

load_DO.pl - A script to load the Disease Ontology OBO file into Elasticsearch.

=head1 SYNOPSIS

 load_DO.pl [options]

    Options:
    --help 
    --man
    --file <DO OBO file> default: /data/doid.obo.gz

e.g.
     ./load_DO.pl
     ./load_DO.pl --file /mydo.obo.gz

=head1 OPTIONS

=over 8

=item B<file> I<DO OBO file>

Provide an alternative location for the DO OBO file.
default: /data/doid.obo.gz


=back

=cut

open (my $fh, '-|', "/bin/gzip -dc $opts->{file}"); 

my $es = Search::Elasticsearch->new( nodes => 'db:9200');
$es->indices->delete( index => 'ontology') if $es->indices->exists( index=> 'ontology');

my $bulk = $es->bulk_helper(
    index => 'ontology',
    type => 'do'
);

#Setup index mappings.
$es->indices->create(
    index   => 'ontology',
    body    => {
        mappings => {
            do => {
                properties => {
                    id => {
                        type => 'string',
                        index => 'not_analyzed'
                    },
                    name       => { type => 'string'  },
                    definition => { type => 'string' },
                    dbxrefs => {
                        type => 'string',
                        index => 'not_analyzed'
                    }
                }
            }
        }
    }
);



my $do_parser = Bio::OntologyIO->new(
    -format => 'obo',
    -ontology_name => 'Disease Ontology',
    -fh => $fh
);

for my $ont ($do_parser->next_ontology()) {
    say "Working on " . $ont->name();

    for my $term ($ont->get_all_terms()) {
        next if $term->is_obsolete;
        say "Working on " . $term->name;

        my @dbxrefs = $term->get_secondary_ids();
        my $id = $term->identifier;
        $bulk->index({
                id => $id,
                source => {
                    id => $id,
                    name => $term->name(),
                    definition => $term->definition(),
                    dbxrefs => \@dbxrefs,
                }
            }
        );
    }
}
$bulk->flush();
close($fh);
