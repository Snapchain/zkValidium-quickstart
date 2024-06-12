# Polygon CDK Quickstart

This tutorial will guide you through the process of setting up a CDK Validium on your local machine. Please refer to https://docs.polygon.technology/cdk/overview/ to read more about the CDK framework.

> Note: Polygon CDK is in public preview stage and subject to changes


## What You'll Learn

In this tutorial, you'll quickly dive into the world of Polygon CDK. You'll learn to set up and run a local CDK-based chain, enabling you to:

- Gain a rapid understanding of Polygon CDK.
- Test smart contracts.
- Execute web3 transactions.
- Investigate network capabilities.

## What You'll Need

This tutorial requires Docker and Docker Compose. They allow you to run multiple services in separate environments. If you haven't installed these tools yet, you can do so by following the guides at the following links:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Recommended System Requirements

Ensure that your system meets the following recommended specifications before starting this tutorial:

- A Linux-based OS (e.g., Ubuntu Server 22.04 LTS)
- At least 16GB RAM with a 4-core CPU
- An AMD64 architecture system

> Note: Does not yet support ARM-based Macs

## What You'll Do

In this tutorial, you'll go through the following steps. Make sure to follow each section in order if this is your first time setting up a zkValidium.

1. Download Configuration Files: You'll start by downloading necessary configuration files from our repository.
2. Launch the Validium Locally: After setting up your workspace, you'll launch the zkValidium on your local machine and ensure all services are running properly.
3. Test the Validium: With your local CDK Validium running, you'll verify its functionalities, including testing block explorers and making transactions.

## Step 1: Download Configuration Files

The first step involves downloading the necessary configuration files from our repository. Run the following commands in your terminal to clone the repository and navigate into it:

```bash
git clone https://github.com/Snapchain/zkValidium-quickstart.git
cd zkValidium-quickstart
```

The repository includes these key files:

- `Docker-compose.yml`: This Docker Compose file defines all the necessary containers to set up the CDK Validium. 
- `Makefile`: This file includes a series of commands that will help you manage your CDK Validium node.
- `config`: This folder contains configuration files required for the CDK Validium.

## Step 2: Launch the Validium Locally

With the repository cloned and your working directory set, let's start up the CDK Validium. First, you'll need to pull the necessary Docker images from Docker Hub:

```bash
docker-compose pull
```

After pulling the images, you can start your local CDK Validium:

```bash
make run
```

To ensure all services are running properly, check the status of each container:

```bash
docker-compose ps 
```

You will see results similar to the following:

```shell
             Name                           Command                  State                   Ports             
---------------------------------------------------------------------------------------------------------------
cdk-validium-aggregator          /bin/sh -c /app/cdk-validi ...   Up             0.0.0.0:50081-                
                                                                                 >50081/tcp,:::50081-          
                                                                                 >50081/tcp, 8123/tcp, 0.0.0.0:
                                                                                 9093->9091/tcp,:::9093-       
                                                                                 >9091/tcp                     
cdk-validium-approve             /bin/sh -c /app/cdk-validi ...   Exit 0                                       
cdk-validium-data-availability   /bin/sh -c /app/cdk-data-a ...   Up             0.0.0.0:8444-                 
                                                                                 >8444/tcp,:::8444->8444/tcp   
cdk-validium-data-node-db        docker-entrypoint.sh postg ...   Up (healthy)   0.0.0.0:5444-                 
                                                                                 >5432/tcp,:::5444->5432/tcp   
cdk-validium-eth-tx-manager      /bin/sh -c /app/cdk-validi ...   Up             8123/tcp, 0.0.0.0:9094-       
                                                                                 >9091/tcp,:::9094->9091/tcp   
cdk-validium-event-db            docker-entrypoint.sh postg ...   Up             0.0.0.0:5435-                 
                                                                                 >5432/tcp,:::5435->5432/tcp   
cdk-validium-explorer-json-rpc   /bin/sh -c /app/cdk-validi ...   Up             8123/tcp, 0.0.0.0:8124-       
                                                                                 >8124/tcp,:::8124->8124/tcp, 0
                                                                                 .0.0.0:8134->8134/tcp,:::8134-
                                                                                 >8134/tcp                     
cdk-validium-explorer-l1         /bin/sh -c mix do ecto.cre ...   Up             0.0.0.0:4000-                 
                                                                                 >4000/tcp,:::4000->4000/tcp   
cdk-validium-explorer-l1-db      docker-entrypoint.sh postg ...   Up             0.0.0.0:5436-                 
                                                                                 >5432/tcp,:::5436->5432/tcp   
cdk-validium-explorer-l2         /bin/sh -c mix do ecto.cre ...   Up             0.0.0.0:4001-                 
                                                                                 >4000/tcp,:::4001->4000/tcp   
cdk-validium-explorer-l2-db      docker-entrypoint.sh postg ...   Up             0.0.0.0:5437-                 
                                                                                 >5432/tcp,:::5437->5432/tcp   
cdk-validium-json-rpc            /bin/sh -c /app/cdk-validi ...   Up             0.0.0.0:8123-                 
                                                                                 >8123/tcp,:::8123->8123/tcp, 0
                                                                                 .0.0.0:8133->8133/tcp,:::8133-
                                                                                 >8133/tcp, 0.0.0.0:9091-      
                                                                                 >9091/tcp,:::9091->9091/tcp   
cdk-validium-l2gaspricer         /bin/sh -c /app/cdk-validi ...   Up             8123/tcp                      
cdk-validium-mock-l1-network     geth --http --http.api adm ...   Up             30303/tcp, 30303/udp, 0.0.0.0:
                                                                                 8545->8545/tcp,:::8545-       
                                                                                 >8545/tcp, 0.0.0.0:8546-      
                                                                                 >8546/tcp,:::8546->8546/tcp   
cdk-validium-pool-db             docker-entrypoint.sh postg ...   Up             0.0.0.0:5433-                 
                                                                                 >5432/tcp,:::5433->5432/tcp   
cdk-validium-prover              zkProver -c /usr/src/app/c ...   Up             0.0.0.0:50052-                
                                                                                 >50052/tcp,:::50052-          
                                                                                 >50052/tcp, 0.0.0.0:50061-    
                                                                                 >50061/tcp,:::50061-          
                                                                                 >50061/tcp, 0.0.0.0:50071-    
                                                                                 >50071/tcp,:::50071->50071/tcp
cdk-validium-sequence-sender     /bin/sh -c /app/cdk-validi ...   Up             8123/tcp                      
cdk-validium-sequencer           /bin/sh -c /app/cdk-validi ...   Up             0.0.0.0:6060-                 
                                                                                 >6060/tcp,:::6060->6060/tcp,  
                                                                                 8123/tcp, 0.0.0.0:9092-       
                                                                                 >9091/tcp,:::9092->9091/tcp   
cdk-validium-state-db            docker-entrypoint.sh postg ...   Up             0.0.0.0:5432-                 
                                                                                 >5432/tcp,:::5432->5432/tcp   
cdk-validium-sync                /bin/sh -c /app/cdk-validi ...   Up             8123/tcp                      
dac-setup-committee              docker-entrypoint.sh npm r ...   Exit 0 
```

If any service isn't running (i.e., in Exit 1 state), you can investigate further using the logs:

```bash
docker-compose logs <container_name>
```

Note: `<container_name>` can be found in results above.


To stop the zkValidium, use:

```bash
make stop
```

And to restart all the services:

```bash
make restart
```

## Step 3: Test the Validium

Congratulations! Your local zkValidium is now up and running. Let's test its functionalities.

First, verify the block explorer by navigating to [localhost:4001](http://localhost:4001/). You should see a page similar to this:

![image](https://github.com/Snapchain/zkValidium-quickstart/assets/111917526/bfc027a2-2f9d-40f4-a229-eb7528cfa51b)

Now, let's add the network to your Web3 wallet by populating the necessary fields.
> **We'll use MetaMask for our example.**

- Set the chain ID to be **1001**. 
- The currency symbol can be anything but we will use **POL** by default. 
- The RPC node and block explorer containers can be found at ports **8123** and **4001**, respectively.

Next, switch to the new network.

By default, an account with private key `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` has been preloaded with tokens.

> Note: NEVER transfer real assets to the address associated with the above private key

Import this account and you will see the balance shown up as 100000 POL. You can now try a transaction by transferring some tokens to another account. After confirming the transaction, check the updated balances. You can also view the transaction details in the block explorer by clicking on the transaction details in MetaMask.
