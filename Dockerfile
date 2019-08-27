FROM fedora

USER 0
ENV OCTAR=oc-4.1.11=linux.tar.gz
ENV OCREL=https://github.com/alexgroom/oc-console/blob/4.x/$OCTAR
ENV GOPATH=/go

# Install OC client tool
RUN  curl -L --silent -o $OCTAR $OCREL && ls -l && \
     yum install -y tar gzip findutils && \
     mkdir /tmp/oc && \
     tar -xvf $OCTAR -C /tmp/oc && \
     find /tmp/oc -name "oc" -type f -exec mv {} /usr/bin \; && \
     rm -rf /tmp/oc $OCTAR && \
     yum clean all 

# Install Gotty
RUN  mkdir /go && chmod 755 /go && yum install -y git golang-bin && go get github.com/yudai/gotty && yum clean all && mkdir /workspace && chmod 777 workspace

WORKDIR /workspace

EXPOSE 8080

USER 1001

ENTRYPOINT ["/go/bin/gotty"]
CMD ["-w","bash"]
