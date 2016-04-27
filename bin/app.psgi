#!/usr/bin/env perl

use strict;
use warnings;
use FindBin;
use lib "$FindBin::Bin/../lib";

use Bio::Gene2Function;
Bio::Gene2Function->to_app;
