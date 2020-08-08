#!/bin/bash 

source variable.sh
source functions.sh
for i in ${SERVICES_LIST[@]}
do 
    source ${i}.sh
done
echo 'Options:
     1. create all services 
     2. start all services
     3. stop all services
     4. remove all services'



read -p "Enter your choice: " option

case $option in
    1) create_all_services ;;
    2) start_all_services  ;;
    3) stop_all_services   ;;
    4) remove_all_services ;;
esac