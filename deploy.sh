#!/bin/bash

# 部署脚本
# 使用方式: ./deploy.sh [preview|prod]

set -e

echo "🚀 开始部署..."

# 检查参数
ENV=${1:-preview}

if [ "$ENV" == "prod" ] || [ "$ENV" == "production" ]; then
    echo "📦 部署到生产环境..."
    vercel --prod
else
    echo "📦 部署到预览环境..."
    vercel
fi

echo "✅ 部署完成!"
