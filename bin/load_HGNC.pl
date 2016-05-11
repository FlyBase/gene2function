#!/usr/bin/env perl
use strict;
use warnings;
use autodie;
use 5.010;

use Getopt::Long;
use Pod::Usage;
use FindBin;
use File::Spec;
use JSON;
use Search::Elasticsearch;

my $opts = {
    help              => 0,
    man               => 0,
    debug             => 0,
    index             => 'ontology',
    type              => 'do',
    file              => '/data/hgnc_mapping.tsv.gz',
};


GetOptions ($opts,
    'file=s',
    'index=s',
    'type=s',
    'debug',
    'help|?',
    'man',
);

pod2usage(1) if $opts->{help};
pod2usage(-exitstatus => 0, -verbose => 2) if $opts->{man};

=head1 NAME

load_HGNC.pl - A script to load the custom HGNC mapping file.

=head1 SYNOPSIS

 load_HGNC.pl [options]

    Options:
    --help 
    --man
    --file <HGNC mapping> default: /data/hgnc_mapping.tsv.gz
    --index <index name> default: ontology
    --type  <type name>  default: do

e.g.
     ./load_HGNC.pl
     ./load_HGNC.pl --file /hgnc.gz --index myindex --type mytype

=head1 OPTIONS

=over 8

=item B<file> I<HGNC mappin file>

Provide an alternative location for the custom HGNC mapping file.
default: /data/hgnc_mapping.tsv.gz

See also L<bin/fetch_hgnc.pl>

=item B<index> I<index name>

The Elasticsearch index to use.

=item B<type> I<type name>

The Elasticsearch type to use.

=back

=cut

my %organisms = map { $_->{id} => $_ } @{load_organisms()};

open (my $fh, '-|', "/bin/gzip -dc $opts->{file}"); 

my $es = Search::Elasticsearch->new( nodes => 'db:9200');
$es->indices->delete( index => $opts->{index}) if $es->indices->exists( index=> $opts->{index});

my $bulk = $es->bulk_helper(
    index => $opts->{index},
    type => $opts->{type}
);

#Setup index mappings.
$es->indices->create(
    index   => $opts->{index},
    body    => {
        mappings => {
            do => {
                properties => {
                    id => {
                        type => 'string',
                        index => 'not_analyzed'
                    },
                    symbol     => {
                        type => 'string',
                        index => 'not_analyzed'
                    },
                    synonyms => {
                        type  => 'string',
                        index => 'not_analyzed'
                    }
                }
            }
        }
    }
);

while (<$fh>) {
    chomp;
    next if /^#/;
    my ($taxid,$geneid,$symbol,@cols) = split /\t/;
    next unless defined $organisms{$taxid}; 

    my @symbols = ($symbol);
    my @synonyms = split /\|/, $cols[1];
    my $name = $cols[8];
    push @synonyms, $cols[7] if ($cols[7] ne '-' && $symbol ne $cols[7]);

    $bulk->index({
            id => $geneid,
            source => {
                id       => $geneid,
                taxid    => $taxid,
                fullname => $name,
                symbol   => $symbol,
                synonyms => \@synonyms
            }
        }
    );
}
$bulk->flush();
close($fh);

sub load_organisms {
    local $/;
    open( my $fh, '<', File::Spec->catfile($FindBin::Bin,'..','conf','organisms.json'));
    my $json_text = <$fh>;
    close($fh);
    return decode_json( $json_text );
}
