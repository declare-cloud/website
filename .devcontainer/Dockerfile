FROM mcr.microsoft.com/devcontainers/typescript-node:22

ARG CONTAINER_USER=node
ARG CONTAINER_GROUP=node
RUN mkdir -p /root/.aws /root/.azure /root/.kube /root/.packer.d /root/.terraform.d /root/.vscode-server /root/.vscode-server-insiders /root/.vscode-server/extensions /root/.vscode-server-insiders/extensions /root/history /root/.ssh/ /root/.local/ \
    && chown -R root:root /root/.aws /root/.azure /root/.kube /root/.packer.d /root/.terraform.d /root/.vscode-server /root/.vscode-server-insiders /root/.vscode-server/extensions /root/.vscode-server-insiders/extensions /root/history /root/.ssh/ /root/.local/ \
    && mkdir -p /home/$CONTAINER_USER/.aws /home/$CONTAINER_USER/.azure /home/$CONTAINER_USER/.kube /home/$CONTAINER_USER/.packer.d /home/$CONTAINER_USER/.terraform.d /home/$CONTAINER_USER/.vscode-server /home/$CONTAINER_USER/.vscode-server-insiders /home/$CONTAINER_USER/.vscode-server/extensions /home/$CONTAINER_USER/.vscode-server-insiders/extensions /home/$CONTAINER_USER/history /home/$CONTAINER_USER/.ssh/ /workspace/node_modules /workspace/.next /workspace/cache \
    && chown -R $CONTAINER_USER:$CONTAINER_GROUP /home/$CONTAINER_USER/.aws /home/$CONTAINER_USER/.azure /home/$CONTAINER_USER/.kube /home/$CONTAINER_USER/.packer.d /home/$CONTAINER_USER/.terraform.d /home/$CONTAINER_USER/.vscode-server /home/$CONTAINER_USER/.vscode-server-insiders /home/$CONTAINER_USER/.vscode-server/extensions /home/$CONTAINER_USER/.vscode-server-insiders/extensions /home/$CONTAINER_USER/history /home/$CONTAINER_USER/.ssh/ /workspace/node_modules /workspace/.next /workspace/cache \
    && SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/root/history/.bash_history" \
    && touch /root/history/.bash_history \
    && chown -R root /root/history \
    && echo "$SNIPPET" >> "/root/.bashrc" \
    && SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/home/$CONTAINER_USER/history/.bash_history" \
    && touch /home/$CONTAINER_USER/history/.bash_history \
    && chown -R $CONTAINER_USER /home/$CONTAINER_USER/history \
    && echo "$SNIPPET" >> "/home/$CONTAINER_USER/.bashrc" \
    && chmod -R 600 /root/.ssh/ \
    && chmod 700 /root/.ssh \
    && chmod -R 600 /home/$CONTAINER_USER/.ssh/ \
    && chmod 700 /home/$CONTAINER_USER/.ssh

USER node

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/home/node/.bun/bin:/workspace/node_modules/.bin:${PATH}"

CMD ["sleep", "infinity"]