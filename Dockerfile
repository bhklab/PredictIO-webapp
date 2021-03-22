# WORK IN PROGRESS: docker image to run the web app

# use python:3.8-slim base image
FROM python:3.8-slim

# install:
# 1. build-essential - essential installation packages for Ubuntu
# 2. r-base - R
# 3. r-cran-randomforest - force R packages to be available.
RUN apt-get update && apt-get install -y --no-install-recommends build-essential r-base r-cran-randomforest

# create work directory where the application is installed
WORKDIR /iodb
ADD . /iodb

# installing python libraries
RUN pip install -r requirements.txt

# installing r libraries
RUN Rscript requirements.R

# run flask when container starts
ENTRYPOINT ["flask"]
CMD ["run", "--host=0.0.0.0", "--port=5000"]