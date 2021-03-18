# commands to set up VM for the web app.

# update apt-get
sudo apt-get update 

# upgrade all upgradable packages
sudo apt upgrade

# 1. Install Python (reference: https://realpython.com/intro-to-pyenv/)

# install build dependencies
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python-openssl

# install pyenv
curl https://pyenv.run | bash

# add the following to .bashrc after installing pyenv: 
# export PATH="$HOME/.pyenv/bin:$PATH"
# eval "$(pyenv init -)"
# eval "$(pyenv virtualenv-init -

 # install Python version 3.8.0
pyenv install -v 3.8.0

# make Python 3.8.0 active in system by default
pyenv global 3.8.0

# 2. Install R 4.* (reference: https://rtask.thinkr.fr/installation-of-r-4-0-on-ubuntu-20-04-lts-and-tips-for-spatial-packages/)

# get keys for the repository
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
sudo apt update

# add repository
sudo add-apt-repository --enable-source --yes "ppa:marutter/rrutter4.0"
sudo add-apt-repository --enable-source --yes "ppa:c2d4u.team/c2d4u4.0+"

# install R
sudo apt install r-base r-base-core

# 3. If not already installed, install git to clone the app repository
sudo apt install git

# 4. Clone the IO.db repository





