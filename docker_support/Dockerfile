# ============================
# Prepare dist Environment
FROM node:22-alpine AS dist-env
WORKDIR /app
# 在安装 git 前设置镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache git
COPY . .
RUN npm install --loglevel verbose
RUN npm run build

# ============================
# Prepare Runtime Environment
FROM nginx:1-alpine

COPY default.conf /etc/nginx/conf.d/

COPY --from=dist-env /app/.vitepress/dist/ /usr/share/nginx/html

EXPOSE 80