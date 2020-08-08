clone_repo() {
    mkdir -p $PROJECT_DIR
    git clone $GIT_REPO_LINK $PROJECT_DIR
    mkdir -p $PROJECT_DIR/data
    mkdir -p $PROJECT_DIR/cache_data
}

create_network() {
    create_network_command='network create 
            --subnet '$NETWORK_SUBNET' '$NETWORK_NAME
    docker $create_network_command
}

execute_services() {
    docker exec -d $PHP_CONTAINER_NAME composer install
}

create_all_services() {
    #  clone_repo
    # create_network
    for i in ${SERVICES_LIST[@]}
    do 
        setup_${i}
    done
    start_all_services
    # execute_services
}

start_all_services() {
    for i in ${SERVICES_LIST[@]}
    do 
        start_${i}
    done
}

stop_all_services() {
    for i in ${SERVICES_LIST[@]}
    do 
        stop_${i}
    done
}

remove_all_services() {
    stop_all_services

    for i in ${SERVICES_LIST[@]}
    do 
        remove_${i}
    done
    
    # docker network rm ${NETWORK_NAME}
}