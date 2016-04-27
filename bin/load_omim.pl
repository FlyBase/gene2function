#!/usr/bin/env perl
use strict;
use warnings;
use 5.010;

use Getopt::Long;
use Pod::Usage;
use File::Spec;
use LWP::Simple;
use Search::Elasticsearch;

my $opts = {
    help              => 0,
    man               => 0,
    debug             => 0,
    fetch             => {},
    index             => 0,
    dir               => '/data/'
};


GetOptions ($opts,
    'fetch=s',
    'index',
    'dir=s',
    'debug',
    'help|?',
    'man',
);

pod2usage(1) if $opts->{help};
pod2usage(-exitstatus => 0, -verbose => 2) if $opts->{man};

=head1 NAME

load_omim.pl - A script to fetch the OMIM genemap2.txt file and index it in Elasticsearch.

=head1 SYNOPSIS

 load_omim.pl [options]

    Options:
    --help 
    --man
    --fetch <file>=<URL> Where <file> is mimtitles or genemap2 and <URL> is the URL location of the file.
    --index Loads the files into the Elastic Search DB.
    --dir  Specifies the local directory to store the files in.  default: /data/

e.g.
     ./load_omim.pl --index
     ./load_omim.pl --fetch genemap2=http://omim.org/download/1234/genemap2.txt --fetch mimtitles=http://omim.org/download/1234/mimTitles.txt --index

=head1 OPTIONS

=over 8

=item B<fetch> I<filename>=I<URL>

Fetch one or more types of OMIM files.
The option takes a key=value parameter where key
is the OMIM file name of either 'mimtitles' or 'genemap2'
and the value is the URL to download the file.

     --fetch genemap2=http://omim.org/download/1234/genemap2.txt 


=item B<index>

Indexes the OMIM files in Elasticsearch.

=item B<dir> I<directory>

Lets you override the default directory location 
during the fetch and index operations. default: /data/

=back

=cut

if (defined $opts->{fetch}) {
    for my $omim_file (keys %{$opts->{fetch}}) {
        my $url = $opts->{fetch}{$omim_file};
        my $file = pop split(/\//, $url);
        my $rc = getstore($url,$opts->{file});
        die "Couldn't fetch OMIM genemap file from $opts->{fetch}: Error code $rc" if is_error $rc;
    }
}

if ($opts->{index}) {
    my $es = Search::Elasticsearch->new( nodes => 'db:9200');
    my $bulk = $es->bulk_helper(
        index => 'omim',
        type => 'genemap'
    );

    open(my $fh, '<', $opts->{file});
    while (<$fh>) {
        chomp;
        next if /^#/;
        my ($c0,$c1,$c2,$c3,$c4,$omim,$c6,$c7,$symbol,$geneid,$col10,$col11,$phenotype,@rest) = split /\t/;

        my @phenotypes;
        @phenotypes = split(/;/,$phenotype) if defined $phenotype;
        map { s/^\s+|\s+$//g } @phenotypes;

        say $omim;
        $bulk->index({
                id => $omim,
                source => {
                    omim        => $omim,
                    symbol      => $symbol,
                    ncbi_geneid => $geneid,
                    phenotype   => [@phenotypes]
                }
            }
        );
    }

    $bulk->flush();

    close($fh);
}



