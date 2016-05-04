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
    help  => 0,
    man   => 0,
    debug => 0,
    index => 'ontology',
    type  => 'do',
    do    => '/data/doid.obo.gz',
    hgnc  => '/data/hgnc_mapping.tsv.gz'
};


GetOptions ($opts,
    'do=s',
    'index=s',
    'type=s',
    'hgnc=s',
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
    --index <index name> default: ontology
    --type  <type name> default: do
    --do <DO OBO file> default: /data/doid.obo.gz
    --hgnc <custom HGNC mapping file> default: /data/hgnc_mapping.tsv.gz

e.g.
     ./load_DO.pl
     ./load_DO.pl --do /mydo.obo.gz

=head1 OPTIONS

=over 8

=item B<do> I<DO OBO file>

Provide an alternative location for the DO OBO file.
default: /data/doid.obo.gz

=item B<index> I<index name>

The Elasticsearch index to use.

=item B<type> I<type name>

The Elasticsearch type to use.

=item B<hgnc> I<HGNC mapping file>

The HGNC mapping file generated from L<bin/fetch_hgnc.pl>
default: /data/hgnc_mapping.tsv.gz

=back

=cut

my $hgnc = load_hgnc($opts->{hgnc});
open (my $fh, '-|', "/bin/gzip -dc $opts->{do}"); 

my $es = Search::Elasticsearch->new( nodes => 'db:9200');
$es->indices->delete( index => 'ontology') if $es->indices->exists( index=> 'ontology');

my $bulk = $es->bulk_helper(
    index => $opts->{index},
    type => $opts->{type}
);

#Setup index mappings.
$es->indices->create(
    index   => $opts->{index},
    body    => {
        mappings => {
            $opts->{type} => {
                properties => {
                    id => {
                        type => 'string',
                        index => 'not_analyzed'
                    },
                    name       => { type => 'string'  },
                    definition => { type => 'string' },
                    dbxrefs => { type=> 'string' },
                    genes => {
                        type => 'string',
                        analyzer => 'simple'
                    },
                    gene_count => { type => 'integer' },
                    suggest => {
                        type => 'completion',
                        analyzer => 'simple',
                        search_analyzer => 'simple',
                        payloads => 'false'
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

        my @dbxrefs    = $term->get_secondary_ids();
        my $genes      = get_omim_genes({ hgnc => $hgnc, dbxrefs => \@dbxrefs });
        my $gene_count = scalar @{$genes};
        my $id         = $term->identifier;

        $bulk->index({
                id => $id,
                source => {
                    id => $id,
                    name => $term->name(),
                    definition => $term->definition(),
                    dbxrefs => \@dbxrefs,
                    genes => $genes,
                    gene_count => $gene_count,
                    suggest => [$id, $term->name()]
                }
            }
        );
    }
}
$bulk->flush();
close($fh);

sub load_hgnc {
    my $hgnc = shift;
    my %result;
    open (my $fh, '-|', "/bin/gzip -dc $hgnc"); 
    while (<$fh>) {
        chomp;
        my (@cols) = split /\t/;
        next unless $cols[0] =~ /^HGNC:\d+$/;
        next unless defined $cols[6] && defined $cols[5];

        if ($cols[5] =~ /\w+/ and $cols[6] =~ /\w+/) {
            $result{$cols[6]} //= [];
            push(@{$result{$cols[6]}},$cols[1]) 
        }
    }
    close($fh);
    return \%result;
}

sub get_omim_genes {
    my ($args) = @_;
    my @genes;

    my $hgnc = $args->{hgnc};

    for my $dbxref (@{$args->{dbxrefs}}) {
        next unless ($dbxref =~ /^OMIM:(\d+)$/);
        $dbxref =~ s/^OMIM://g; #Strip OMIM prefix off.
        if (defined $hgnc->{$dbxref}) {
            push(@genes,@{$hgnc->{$dbxref}});
        }
    }
    return \@genes;

}

