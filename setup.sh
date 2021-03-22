# Commands to set up VM for the web app. 

# Install tools used for the setup. 
    # update apt-get
    sudo apt-get update 

    # upgrade all upgradable packages
    sudo apt upgrade

    # install build dependencies for python pakcages
    sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
    libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python-openssl 

    # install build dependencies for R pakcages
    sudo apt-get install -y libcurl4-openssl-dev libxml2-dev


# 1. Install Python (reference: https://realpython.com/intro-to-pyenv/)

# install pyenv
curl https://pyenv.run | bash

# add the following to .bashrc after installing pyenv: 
    # export PATH="$HOME/.pyenv/bin:$PATH"
    # eval "$(pyenv init -)"
    # eval "$(pyenv virtualenv-init -)

 # install Python version 3.8.0
pyenv install -v 3.8.0

# make Python 3.8.0 active in system by default
pyenv global 3.8.0



# 2. Install R 4.* (reference: https://rtask.thinkr.fr/installation-of-r-4-0-on-ubuntu-20-04-lts-and-tips-for-spatial-packages/)

# get keys for the repository
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9

# add repository
sudo add-apt-repository --enable-source --yes "ppa:marutter/rrutter4.0"
sudo add-apt-repository --enable-source --yes "ppa:c2d4u.team/c2d4u4.0+"
sudo apt update

# install R
sudo apt install -y r-base r-base-core

# 3. If not already installed, install git to clone the app repository
sudo apt install git

# 4. Clone the IO.db repository
git clone https://github.com/bhklab/IOdb.git 
# after this, use SCP to transfer untracked files (.env and RData files) 
scp -i <path to the key> <path to file or dir> <username>@<hostname>:/<path>

# 5. Install Python dependencies
pip install -r requirements.txt

# 6. Install R dependencies
sudo Rscript requirements.R # this takes a while

# set up Nginx and Gunicorn to run the app (Reference: https://blog.miguelgrinberg.com/post/how-to-deploy-a-react--flask-project)

# 8. Install and configure nginx to serve react front end
sudo apt-get install -y nginx

# check if nginx is running by going to the URL -> you should see a default Nginx page.

# disable the default website
sudo rm /etc/nginx/sites-enabled/default

# create iodb.nginx file under /etc/nginx/sites-available directory, and add the following:
    # server {
    #     listen 80;
    #     root /home/ubuntu/IOdb/client/build; # Sets the root directory to React's build file.
    #     index index.html; # The index file in the build directory.

    #     location / {
    #         try_files $uri $uri/ =404;
    #         add_header Cache-Control "no-cache"; # caching directives
    #     }

    #     location /static {
    #         expires 1y;
    #         add_header Cache-Control "public"; # caching directives
    #     }

    #     location /api { # reverse proxy for the API service - all the URLs that begin with /api follows this proxy 
    #     	include proxy_params;
    #     	proxy_pass http://localhost:5000;
    #     }
    # }

# Reload nginx so the changes take effect
sudo systemctl reload nginx

# 9. Install and configure Gunicorn to run the Flask API
pip install gunicorn

# Add iodb.service file to /etc/systemd/system directory with the following content:
    # [Unit]
    # Description=IO.db Flask API
    # After=network.target

    # [Service]
    # User=ubuntu
    # WorkingDirectory=/home/ubuntu/IOdb # root of the web app
    # ExecStart=/home/ubuntu/.pyenv/shims/gunicorn -b 127.0.0.1:5000 app:app 
        # /home/ubuntu/.pyenv/shims/gunicorn is the path to Gunicorn.
        # 127.0.0.1:5000 localhost IP and port to start the API service.
        # app:app points to the "app" variable in app.py 
    # Restart=always

    # [Install]
    # WantedBy=multi-user.target

# Reload systemd to reflect that change.
sudo systemctl daemon-reload

# Start the iodb API
sudo systemctl start iodb # name of the .service file.

# Ensure that the API is running 
sudo systemctl status iodb # you should see "Active: active (running)" you can find around the third line of the output.

# 10. Set firewall with Uncomplicated Firewall (ufw) to allow only ssh, http and https connections to the server.
sudo ufw allow ssh http https