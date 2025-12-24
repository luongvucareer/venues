# 🐘 Hướng Dẫn Setup PostgreSQL Database với Docker

Hướng dẫn đơn giản, dễ hiểu cho người mới bắt đầu với Docker.

## 📋 Mục Lục

- [Docker là gì?](#docker-là-gì)
- [Cài đặt Docker](#cài-đặt-docker)
- [Setup Database](#setup-database)
- [Sử dụng Database](#sử-dụng-database)
- [Quản lý Database](#quản-lý-database)
- [Troubleshooting](#troubleshooting)

---

## Docker là gì?

**Docker** là công cụ giúp bạn chạy ứng dụng trong môi trường "container" (container = hộp chứa).

### Tại sao dùng Docker cho Database?

✅ **Dễ dàng**: Chỉ cần 1 lệnh, không cần cài đặt PostgreSQL phức tạp  
✅ **Sạch sẽ**: Không làm "bẩn" máy tính của bạn  
✅ **Linh hoạt**: Dễ dàng xóa, tạo lại, backup  
✅ **Giống Production**: Môi trường giống như server thật

### So sánh:

**Không dùng Docker:**

```bash
# Phải cài PostgreSQL vào máy
# Phải cấu hình PATH, users, permissions
# Khó gỡ bỏ hoàn toàn
# Mỗi máy cài khác nhau
```

**Dùng Docker:**

```bash
# Chỉ cần: docker compose up -d
# PostgreSQL chạy trong "hộp", không ảnh hưởng máy
# Xóa dễ dàng: docker compose down
# Chạy giống nhau trên mọi máy
```

---

## Cài đặt Docker

### macOS

1. **Tải Docker Desktop:**
   - Truy cập: https://www.docker.com/products/docker-desktop
   - Click "Download for Mac"
   - Chọn chip (Intel hoặc Apple Silicon/M1/M2)

2. **Cài đặt:**
   - Mở file `.dmg` đã tải
   - Kéo Docker vào thư mục Applications
   - Mở Docker Desktop từ Applications
   - Đợi Docker khởi động (biểu tượng cá voi ở menu bar)

3. **Kiểm tra:**

   ```bash
   docker --version
   # Kết quả: Docker version 24.x.x

   docker compose version
   # Kết quả: Docker Compose version v2.x.x
   ```

### Windows

1. **Yêu cầu:**
   - Windows 10/11 (64-bit)
   - WSL2 (Windows Subsystem for Linux 2)

2. **Cài WSL2:**

   ```powershell
   # Mở PowerShell với quyền Administrator
   wsl --install
   # Khởi động lại máy
   ```

3. **Cài Docker Desktop:**
   - Tải: https://www.docker.com/products/docker-desktop
   - Chạy installer
   - Khởi động lại máy nếu cần
   - Mở Docker Desktop

4. **Kiểm tra:**
   ```powershell
   docker --version
   docker compose version
   ```

### Linux (Ubuntu/Debian)

```bash
# Cập nhật packages
sudo apt-get update

# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group (không cần sudo)
sudo usermod -aG docker $USER
newgrp docker

# Kiểm tra
docker --version
docker compose version
```

---

## Setup Database

### Bước 1: Chuẩn bị môi trường

```bash
# Di chuyển vào thư mục project
cd /path/to/venues

# Copy file cấu hình
cp .env.local .env

# (Optional) Chỉnh sửa nếu muốn đổi password
nano .env  # hoặc dùng editor bất kỳ
```

### Bước 2: Khởi động PostgreSQL

```bash
# Khởi động database
docker compose -f docker-compose.db.yml up -d

# Giải thích lệnh:
# - docker compose: Công cụ chạy nhiều containers
# - -f docker-compose.db.yml: File cấu hình
# - up: Khởi động
# - -d: Chạy nền (detached mode)
```

**Lần đầu chạy sẽ:**

- Tải image PostgreSQL (~ 100MB)
- Tạo container
- Khởi động database
- Tạo database tên "venues"

### Bước 3: Kiểm tra Database đã chạy

```bash
# Xem trạng thái containers
docker compose -f docker-compose.db.yml ps

# Kết quả mong đợi:
# NAME              STATUS         PORTS
# venues-postgres   Up 2 minutes   0.0.0.0:5432->5432/tcp
```

### Bước 4: Setup Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema lên database (tạo tables)
npm run db:push

# Hoặc chạy migrations
npm run db:migrate
```

### Bước 5: Chạy ứng dụng

```bash
# Khởi động Next.js
npm run dev

# Truy cập: http://localhost:3000
```

---

## Sử dụng Database

### Kết nối từ Code

Prisma sẽ tự động kết nối qua `DATABASE_URL` trong `.env`:

```typescript
// src/lib/prisma.ts đã được cấu hình sẵn
import { prisma } from "@/lib/prisma";

// Sử dụng
const users = await prisma.user.findMany();
```

### Kết nối trực tiếp qua psql

```bash
# Cách 1: Từ trong container
docker exec -it venues-postgres psql -U postgres -d venues

# Cách 2: Từ máy local (cần cài psql)
psql -h localhost -p 5432 -U postgres -d venues

# Password: postgres (hoặc password bạn đã đặt trong .env)
```

### Kết nối qua GUI Tools

**Option 1: pgAdmin (đã tích hợp)**

```bash
# Khởi động pgAdmin
docker compose -f docker-compose.db.yml --profile tools up -d

# Truy cập: http://localhost:5050
# Email: admin@admin.com
# Password: admin

# Thêm server:
# - Name: Venues DB
# - Host: postgres (quan trọng!)
# - Port: 5432
# - Username: postgres
# - Password: postgres
```

**Option 2: TablePlus / DBeaver / DataGrip**

Cấu hình kết nối:

- **Host:** localhost
- **Port:** 5432
- **Database:** venues
- **Username:** postgres
- **Password:** postgres

---

## Quản lý Database

### Xem Logs

```bash
# Xem logs database
docker compose -f docker-compose.db.yml logs postgres

# Theo dõi real-time
docker compose -f docker-compose.db.yml logs -f postgres

# Xem 50 dòng cuối
docker compose -f docker-compose.db.yml logs --tail=50 postgres
```

### Dừng Database

```bash
# Dừng (data vẫn còn)
docker compose -f docker-compose.db.yml stop

# Khởi động lại
docker compose -f docker-compose.db.yml start
```

### Xóa Database

```bash
# Xóa container nhưng GIỮ data
docker compose -f docker-compose.db.yml down

# Xóa container VÀ data (⚠️ cẩn thận!)
docker compose -f docker-compose.db.yml down -v
```

### Backup Database

```bash
# Backup ra file
docker exec venues-postgres pg_dump -U postgres venues > backup.sql

# Với timestamp
docker exec venues-postgres pg_dump -U postgres venues > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore từ file backup
docker exec -i venues-postgres psql -U postgres venues < backup.sql
```

### Reset Database (Xóa tất cả data)

```bash
# Cách 1: Xóa và tạo lại
docker compose -f docker-compose.db.yml down -v
docker compose -f docker-compose.db.yml up -d
npm run db:push

# Cách 2: Chạy lại migrations
npx prisma migrate reset
```

### Prisma Studio (GUI Database)

```bash
# Mở Prisma Studio
npm run db:studio

# Hoặc
npx prisma studio

# Truy cập: http://localhost:5555
# Giao diện quản lý database trực quan
```

---

## Troubleshooting

### ❌ Port 5432 đã được sử dụng

**Nguyên nhân:** Bạn đã cài PostgreSQL trực tiếp trên máy

**Giải pháp 1:** Dừng PostgreSQL trên máy

```bash
# macOS
brew services stop postgresql

# Linux
sudo systemctl stop postgresql

# Windows
# Vào Services > PostgreSQL > Stop
```

**Giải pháp 2:** Đổi port trong `docker-compose.db.yml`

```yaml
ports:
  - "5433:5432" # Thay 5432 -> 5433
```

Và cập nhật `.env`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/venues
```

### ❌ Docker daemon not running

**Nguyên nhân:** Docker Desktop chưa khởi động

**Giải pháp:**

- Mở Docker Desktop
- Đợi biểu tượng cá voi ở menu bar
- Chạy lại lệnh

### ❌ Permission denied

**Linux:**

```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER
newgrp docker
```

### ❌ Database connection failed

```bash
# Kiểm tra container có chạy không
docker compose -f docker-compose.db.yml ps

# Kiểm tra logs
docker compose -f docker-compose.db.yml logs postgres

# Kiểm tra health
docker inspect venues-postgres | grep -A 10 Health
```

### ❌ Cannot connect from app

**Kiểm tra DATABASE_URL trong `.env`:**

```bash
# Phải là localhost (KHÔNG phải postgres)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/venues

# Restart dev server
npm run dev
```

### ❌ Out of disk space

```bash
# Xem dung lượng Docker
docker system df

# Dọn dẹp
docker system prune -a --volumes

# Cẩn thận: Lệnh này xóa TẤT CẢ images và volumes không dùng
```

---

## Lệnh Thường Dùng

```bash
# ========================================
# KHỞI ĐỘNG & DỪNG
# ========================================

# Khởi động database
docker compose -f docker-compose.db.yml up -d

# Khởi động + pgAdmin
docker compose -f docker-compose.db.yml --profile tools up -d

# Dừng
docker compose -f docker-compose.db.yml stop

# Khởi động lại
docker compose -f docker-compose.db.yml restart

# Xóa (giữ data)
docker compose -f docker-compose.db.yml down

# Xóa (xóa luôn data)
docker compose -f docker-compose.db.yml down -v

# ========================================
# KIỂM TRA & DEBUG
# ========================================

# Xem containers đang chạy
docker compose -f docker-compose.db.yml ps

# Xem logs
docker compose -f docker-compose.db.yml logs -f

# Vào shell của container
docker exec -it venues-postgres sh

# Kết nối psql
docker exec -it venues-postgres psql -U postgres -d venues

# ========================================
# BACKUP & RESTORE
# ========================================

# Backup
docker exec venues-postgres pg_dump -U postgres venues > backup.sql

# Restore
docker exec -i venues-postgres psql -U postgres venues < backup.sql

# ========================================
# PRISMA
# ========================================

# Generate client
npm run db:generate

# Push schema
npm run db:push

# Run migrations
npm run db:migrate

# Prisma Studio
npm run db:studio

# Reset database
npx prisma migrate reset
```

---

## Tips & Best Practices

### 💡 Tip 1: Luôn chạy database trước khi code

```bash
# Workflow hàng ngày
docker compose -f docker-compose.db.yml up -d  # Start DB
npm run dev                                     # Start app
```

### 💡 Tip 2: Dùng alias cho lệnh ngắn gọn

Thêm vào `~/.zshrc` hoặc `~/.bashrc`:

```bash
alias dbup='docker compose -f docker-compose.db.yml up -d'
alias dbdown='docker compose -f docker-compose.db.yml down'
alias dblogs='docker compose -f docker-compose.db.yml logs -f postgres'
alias dbshell='docker exec -it venues-postgres psql -U postgres -d venues'
```

Sau đó:

```bash
source ~/.zshrc  # Reload
dbup             # Khởi động DB
dblogs           # Xem logs
```

### 💡 Tip 3: Backup định kỳ

Tạo script `backup-db.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec venues-postgres pg_dump -U postgres venues > "backups/backup_$DATE.sql"
echo "✅ Backup saved: backup_$DATE.sql"
```

Chạy:

```bash
chmod +x backup-db.sh
./backup-db.sh
```

### 💡 Tip 4: Xem data nhanh

```bash
# Mở Prisma Studio
npm run db:studio

# Hoặc dùng psql
docker exec -it venues-postgres psql -U postgres -d venues -c "SELECT * FROM users;"
```

---

## Câu Hỏi Thường Gặp

### Q: Docker có tốn nhiều tài nguyên không?

**A:** PostgreSQL container chỉ dùng ~50-100MB RAM khi idle. Rất nhẹ!

### Q: Data có mất khi tắt máy không?

**A:** KHÔNG. Data được lưu trong Docker volume, vẫn còn sau khi:

- Tắt máy
- Restart Docker
- Stop container

Chỉ mất khi bạn chạy: `docker compose down -v`

### Q: Có thể dùng nhiều database cùng lúc không?

**A:** CÓ. Đổi port cho mỗi database:

```yaml
# docker-compose.db.yml
ports:
  - "5432:5432"  # Database 1

# docker-compose.db2.yml
ports:
  - "5433:5432"  # Database 2
```

### Q: Tôi nên dùng Docker hay cài PostgreSQL trực tiếp?

**A:**

- **Docker**: Khuyến nghị cho development
- **Cài trực tiếp**: Nếu bạn cần performance tốt nhất cho production

### Q: Làm sao biết database đang chạy?

```bash
# Cách 1
docker compose -f docker-compose.db.yml ps

# Cách 2
docker ps | grep postgres

# Cách 3
curl http://localhost:5432
# Nếu database chạy, bạn sẽ thấy binary output
```

---

## Tài Liệu Tham Khảo

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker compose -f docker-compose.db.yml logs postgres`
2. Tìm trong phần [Troubleshooting](#troubleshooting)
3. Mở issue trên GitHub: [venues/issues](https://github.com/luongvucareer/venues/issues)

---

**Chúc bạn setup thành công! 🎉**
