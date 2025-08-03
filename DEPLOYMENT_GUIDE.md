# 🚀 TYK CMS Deployment Guide

## Adım 1: GitHub Repository Oluştur

1. **GitHub.com'a git** ve yeni repository oluştur:
   - Repository name: `tyk-cms`
   - Private/Public seçimi yap
   - **"Create repository"** tıkla

2. **Local'deki kodu push et:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tyk-cms.git
   git branch -M main
   git push -u origin main
   ```

## Adım 2: Neon Database Setup

1. **[neon.tech](https://neon.tech) adresine git**
2. **Sign up** veya **Login**
3. **"Create Database"** tıkla
4. Database name: `tyk_cms`
5. Region: **Europe (Frankfurt)** seç (Türkiye'ye yakın)
6. **Connection string'i kopyala** (şuna benzer):
   ```
   postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/tyk_cms?sslmode=require
   ```

## Adım 3: Vercel Deploy

1. **[vercel.com](https://vercel.com) adresine git**
2. **"Import Project"** tıkla
3. **GitHub repository'ni seç** (tyk-cms)
4. **Framework Preset**: Next.js (otomatik seçili)
5. **Environment Variables ekle:**

   ```env
   DATABASE_URL=[Neon'dan kopyaladığın connection string]
   NEXTAUTH_SECRET=minimum-32-karakter-random-string-yarat
   NEXTAUTH_URL=https://[your-project-name].vercel.app
   ```

   **NEXTAUTH_SECRET oluşturmak için:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **"Deploy"** butonuna tıkla

## Adım 4: Database Migration

Deploy tamamlandıktan sonra:

1. **Vercel Dashboard > Functions tab'ına git**
2. Eğer hata varsa logs'u kontrol et
3. **Local'de database'i test et:**
   ```bash
   # .env.local dosyası oluştur
   DATABASE_URL="neon-connection-string"
   
   # Migration çalıştır
   npm run db:push
   npm run db:seed
   ```

## Adım 5: İlk Admin Kullanıcısı

Seed script ile otomatik oluşturuldu:
- **Email**: admin@tyk-cms.com
- **Password**: admin123

**ÖNEMLİ**: İlk girişten sonra şifreyi değiştir!

## Adım 6: Custom Domain (Opsiyonel)

1. **Vercel Dashboard > Settings > Domains**
2. **"Add Domain"** tıkla
3. Domain'ini ekle ve DNS ayarlarını yap

## 🎯 Kontrol Listesi

- [ ] GitHub'a kod push edildi
- [ ] Neon database oluşturuldu
- [ ] Vercel'e deploy edildi
- [ ] Environment variables eklendi
- [ ] Database migration çalıştı
- [ ] Admin kullanıcısı ile giriş yapıldı
- [ ] Media upload test edildi

## 🔧 Troubleshooting

**Database bağlantı hatası:**
- CONNECTION_STRING'de `?sslmode=require` olduğundan emin ol
- Neon dashboard'da database'in aktif olduğunu kontrol et

**Build hatası:**
- `npm run build` local'de çalıştır
- Hataları düzelt ve tekrar push et

**Auth hatası:**
- NEXTAUTH_URL'in deployment URL'i ile aynı olduğundan emin ol
- NEXTAUTH_SECRET'in en az 32 karakter olduğunu kontrol et

## 📱 Deployment URL'leri

Deploy tamamlandıktan sonra:
- **Frontend**: https://tyk-cms.vercel.app
- **Admin Panel**: https://tyk-cms.vercel.app/admin
- **API**: https://tyk-cms.vercel.app/api

---

**Sorun yaşarsan:** Hata mesajını paylaş, yardımcı olayım! 🚀