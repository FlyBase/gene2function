#!/usr/bin/env perl

use strict;
use warnings;
use 5.010;

use File::Spec;
use FindBin;


for my $url (@ARGV) {
    my $filename = (split /\//, $url)[-1] . '.gz';

    my $file = File::Spec->catdir(File::Spec->rootdir,'data',$filename);

    system("curl -s $url | gzip > $file");
}

