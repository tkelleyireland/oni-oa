#!/bin/env python

import sys
import subprocess
import time
import os
import csv
import datetime

def main():

    # validate parameters date and dns_path
    validate_parameters(sys.argv)

    # get parameters.
    dns_scores = sys.argv[1]
    dbase = sys.argv[2]
    storage_path = sys.argv[3]
    impala_node = sys.argv[4]

    with open(dns_scores,'rb') as dns_csv:
        rows = csv.reader(dns_csv, delimiter=',', quotechar='|')

        # remove headers.
        next(dns_csv)

        for row in rows:

            # get data to query
            date=row[0].split(" ")
            date = filter(None,date)
            if len(date) == 5:
                year=date[2]
                month=datetime.datetime.strptime(date[0], '%b').strftime('%m')
                day=date[1]
                ip_dst=row[2]
                get_dendro(dbase,ip_dst,year,month,day,storage_path,impala_node)

def get_dendro(dbase,ip_dst,year,month,day,storage_path,impala_node):

    if not os.path.isfile("{0}dendro-{1}.csv".format(storage_path,ip_dst)):

        dndro_qry = ("SELECT dns_a, dns_qry_name, ip_dst FROM (SELECT susp.ip_dst, susp.dns_qry_name, susp.dns_a FROM {0}.dns as susp WHERE susp.y={1} AND susp.m={2} AND susp.d={3}  AND susp.ip_dst=\"{4}\" ) AS tmp GROUP BY dns_a, dns_qry_name, ip_dst").format(dbase,year,month,day,ip_dst)

        dendro_file = "{0}dendro-{1}.csv".format(storage_path,ip_dst)
        impala_cmd = "impala-shell -i {0} --print_header -B --output_delimiter=',' -q '{1}' -o {2}".format(impala_node,dndro_qry,dendro_file)

        print impala_cmd
        subprocess.call(impala_cmd,shell=True)

def validate_parameters(params):

    usage="usage dns_suspicious_dendrogram.py "
    if len(params) < 3:
        print usage
        sys.exit(1)


if __name__ == '__main__':
    main()
