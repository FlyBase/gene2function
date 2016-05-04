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
    index             => 'gene',
    type              => 'symbol',
    file              => '/data/gene_info.gz',
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

load_gene_info.pl - A script to load the NCBI gene_info file into Elasticsearch.

=head1 SYNOPSIS

 load_gene_info.pl [options]

    Options:
    --help 
    --man
    --file <NCBI gene_info file> default: /data/gene_info.gz
    --index <index name> default: gene
    --type  <type name>  default: symbol

e.g.
     ./load_gene_info.pl
     ./load_gene_info.pl --file /gene_info.gz --index myindex --type mytype

=head1 OPTIONS

=over 8

=item B<file> I<NCBI gene_info file>

Provide an alternative location for the gene_info file.
default: /data/gene_info.gz

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
            $opts->{type} => {
                properties => {
                    id => {
                        type => 'string',
                        index => 'not_analyzed'
                    },
                    symbol     => {
                        type => 'string',
                        analyzer => 'simple'
                    },
                    fullname => {
                        type => 'string',
                        analyzer => 'simple'
                    },
                    symbol_synonyms => {
                        type  => 'string',
                        analyzer => 'simple'
                    },
                    taxid => {
                        type => 'integer',
                        index => 'not_analyzed'
                    },
                    dbxrefs => { 
                        type=> 'string',
                        analyzer => 'standard'
                    },
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

while (<$fh>) {
    chomp;
    next if /^#/;
    my ($taxid,$geneid,$symbol,@cols) = split /\t/;
    next unless defined $organisms{$taxid}; 

    my @symbols = ($symbol);
    my @synonyms = split /\|/, $cols[1];
    my $name = $cols[8];
    my @dbxrefs;
    @dbxrefs = split /\|/, $cols[2] if ($cols[2] ne '-');

    push @synonyms, $cols[7] if ($cols[7] ne '-' && $symbol ne $cols[7]);

    my @suggest;
    push(@suggest,$geneid,$symbol,@dbxrefs);

    $bulk->index({
            id => $geneid,
            source => {
                id              => $geneid,
                taxid           => $taxid,
                fullname        => $name,
                symbol          => $symbol,
                symbol_synonyms => \@synonyms,
                dbxrefs         => \@dbxrefs,
                suggest         => \@suggest
            }
        }
    );
}
$bulk->flush();
close($fh);

sub load_organisms {
    local $/;
    open( my $fh, '<', File::Spec->catfile($FindBin::Bin,'..','data','organisms.json'));
    my $json_text = <$fh>;
    close($fh);
    return decode_json( $json_text );
}
