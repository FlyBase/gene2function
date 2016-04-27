#!/usr/bin/perl -w
use strict;
use LWP::Simple;
my $url = 'http://www.genenames.org/cgi-bin/download?'.
          'col=gd_hgnc_id&'.
          'col=gd_app_sym&'.
          'col=gd_app_name&'.
          'col=gd_prev_sym&'.
          'col=gd_aliases&'.
          'col=md_eg_id&'.
          'col=md_mim_id&'.
          'col=md_prot_id&'.
          'col=md_ensembl_id&'.
          'status=Approved&'.
          'status_opt=2&'.
          'where=&'.
          'order_by=gd_app_sym_sort&'.
          'format=text&'.
          'limit=&'.
          'hgnc_dbtag=on&'.
          'submit=submit';
my $page = get($url);
print $page;
