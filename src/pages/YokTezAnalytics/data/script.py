import json
import os

# Dosya isimlerini buraya yazıyoruz
script_dizini = os.path.dirname(os.path.abspath(__file__))

# Dosya yollarını script'in olduğu yere göre tam adres (absolute path) yapıyoruz:
json_dosyasi = os.path.join(script_dizini, 'tez2.json')
silinecek_dosyasi = os.path.join(script_dizini, 'silinecekler.txt')
cikti_dosyasi = os.path.join(script_dizini, 'temizlenmis_veri2.json')

print("İşlem başlıyor...")
print(f"Çalışılan Dizin: {script_dizini}") # Kontrol için ekrana basalım

# 1. Silinecek ID'leri txt dosyasından oku ve bir kümeye (set) at
# (Set kullanıyoruz çünkü binlerce veri içinde arama yapmak set ile çok hızlıdır)
try:
    with open(silinecek_dosyasi, 'r', encoding='utf-8') as f:
        # Her satırdaki boşlukları temizle (strip) ve kümeye ekle
        silinecek_nolar = set(line.strip() for line in f if line.strip())
    print(f"{len(silinecek_nolar)} adet silinecek tez numarası yüklendi.")
except FileNotFoundError:
    print(f"HATA: {silinecek_dosyasi} dosyası bulunamadı!")
    exit()

# 2. JSON verisini yükle
try:
    with open(json_dosyasi, 'r', encoding='utf-8') as f:
        tum_tezler = json.load(f)
    print(f"Toplam {len(tum_tezler)} adet veri yüklendi. Filtreleme başlıyor...")
except FileNotFoundError:
    print(f"HATA: {json_dosyasi} dosyası bulunamadı!")
    exit()

# 3. Filtreleme İşlemi (JavaScript'teki .filter mantığı ile aynı)
# Eğer tezin numarası, silinecekler listesinde YOKSA, yeni listeye al.
kalan_tezler = [tez for tez in tum_tezler if tez.get("Tez No") not in silinecek_nolar]

# 4. Sonucu Kaydet
with open(cikti_dosyasi, 'w', encoding='utf-8') as f:
    json.dump(kalan_tezler, f, ensure_ascii=False, indent=4)

silinen_adet = len(tum_tezler) - len(kalan_tezler)
print(f"İşlem tamamlandı! {silinen_adet} adet tez silindi.")
print(f"Temiz veriler '{cikti_dosyasi}' olarak kaydedildi.")

print("\n--- KLASÖRDEKİ DOSYALAR ---")
files = os.listdir(script_dizini)
for file in files:
    print(file)
print("---------------------------")