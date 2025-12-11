import React, { useState } from 'react';
import { X } from 'lucide-react';

const BoardMembers = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const members = [
    {
      id: 1,
      name: 'Ahmet YAPICI',
      title: 'Başkan',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_10.jpg',
      bio: `İlahiyat alanında lisans (2000), Din Sosyolojisi alanında yüksek lisans (2012) eğitimlerini Marmara Üniversitesinde tamamladı.

10 yıl Diyanet İşleri Başkanlığında çalıştıktan sonra Millî Eğitim Bakanlığı bünyesinde imam hatip lisesi meslek dersleri kitapları, din dersi kitapları ve seçmeli din dersleri kitapları yazarlığı; öğretmen, müdür yardımcısı, okul müdürü ve şube müdürlüğü yaptı.

Hâlen İstanbul İl Millî Eğitim Müdür Yardımcısı olarak görev alan Ahmet Yapıcı'nın İnanmış Bir Adam Mehmet Akif Ersoy, Tekkeler ve Cumhuriyet, Ailemizle 52 Ders Serisi gibi yayımlanmış kitapları vardır ve Gümüş Kalemler yazar grubu üyesidir.`,
    },
    {
      id: 2,
      name: 'Dr. Muhammed ÇELİK',
      title: 'Başkan Yardımcısı',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `1986 yılında Tokat'ta doğdu. İlkokulu Tokat'ta, ortaokul ve liseyi İstanbul'da tamamladı. 2008 yılında Selçuk Üniversitesi Eğitim Fakültesi İngilizce Öğretmenliği bölümünden mezun oldu. 2013 yılında Sakarya Üniversitesi Eğitim Bilimleri Enstitüsü Eğitim Yönetimi ve Denetimi Anabilim Dalı'nda yüksek lisans, 2019 yılında ise aynı alandaki doktora eğitimini Bolu Abant İzzet Baysal Üniversitesi'nde tamamladı.

Millî Eğitim Bakanlığına bağlı yurt içi ve yurt dışı (Cidde Uluslararası Türk Okulu, Suudi Arabistan) her kademe okulda (ilkokul, ortaokul, lise, imam hatip, bilsem), bazı AB ve ABD projelerinde (Erasmus Öğrenci Değişim Programı, Piktes+, Comenius, Grundtvig, Work and Travel), çeşitli özel kurum ve sivil toplum örgütlerinde öğretmenlik, idarecilik, proje uzmanlığı, editörlük ve liderlik görevlerinde bulundu.

Hâlen İstanbul İl Millî Eğitim Müdürlüğü bünyesinde gerçekleştirilen akademik kongrelerin planlanması ve yürütülmesinde aktif görev almakta; ayrıca yayıma hazırlanan hakemli bir akademik yayın olan İstanbul Eğitim Dergisi'nin başeditörlüğü görevini yürütmektedir.`,
    },
    {
      id: 3,
      name: 'Halit ÇABUK',
      title: 'Sekreter',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `30.10.2000 tarihinde İstanbul'da doğdu. TOKİ Aliya İzzetbegoviç Anadolu İmam Hatip Lisesi mezunudur. Marmara Üniversitesi Siyasal Bilgiler Fakültesi'nde Siyaset Bilimi ve Uluslararası İlişkiler bölümünden mezun oldu. Aynı üniversitede Orta Doğu ve İslam Ülkeleri Enstitüsünde yüksek lisans eğitimine devam etmektedir. Şu anda Türkiye Maarif Vakfı'nda çalışmaktadır.`,
    },
    {
      id: 4,
      name: 'Doç. Dr. Özkan ÖZTÜRK',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_6.jpg',
      bio: `1979 senesinde İstanbul-Kartal'da doğdu. 1997 yılında Kartal Anadolu İmam Hatip Lisesi'nden mezun oldu. 2003 senesinde Marmara Üniversitesi İlahiyat Fakültesi'nde lisans eğitimini bitirdi. Marmara Üniversitesi Sosyal Bilimler Enstitüsü'nde başladığı yüksek lisansını, 2007 yılında "Çağdaş Türk Düşüncesinde İbn Arabî Felsefesinin Ele Alınışı" başlıklı tezi ile bitirdi. 2014 yılında ise aynı enstitüde "Tasavvuf Geleneğinin Osmanlı Siyasî Düşüncesinde Tezâhürü" başlıklı doktora çalışmasını tamamladı. Her iki çalışmasını da Prof. Dr. İsmail KARA'nın danışmanlığında gerçekleştirdi.

2003-2015 yılları arasında Milli Eğitim Bakanlığı'na bağlı okullarda öğretmenlik ve idarecilik görevlerinde bulundu. 2015 yılında göreve başladığı Tekirdağ Namık Kemal Üniversitesi İlahiyat Fakültesi'nde öğretim üyeliği ve dekan yardımcılığı vazifelerinde bulundu. Tekirdağ Namık Kemal Üniversitesi İlahiyat Fakültesi'nde Doç. Dr. olarak çalışmalarına devam eden Özkan Öztürk, 25.11.2020 yılında Kartal Anadolu İmam Hatip Lisesi Müdürü olarak görevlendirildi. Öztürk, evli ve iki çocukludur.`,
    },
    {
      id: 5,
      name: 'Sema BEKİROĞLU',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_8.jpg',
      bio: `Lisans eğitimini 1999'da Marmara Üniversitesi Atatürk Eğitim Fakültesi Tarih Öğretmenliği Bölümünde tamamladı. Yüksek lisans eğitimine Sabahattin Zaim Üniversitesi Sosyal Bilimler Enstitüsü'nde Tarih ve Medeniyet Araştırmaları dalında devam ederek 2020 yılında "Sadettin Ökten'de Medeniyet Tasavvuru ve Çağdaşı Düşünürlerle Mukayesesi" başlıklı tezini yazdı. 2022'de Sadettin Ökten ve Medeniyet Tasavvuru kitabı yayımlandı.

Çeşitli sivil toplum kuruluşlarında kültür ve eğitim alanındaki projelere katılmıştır. Özel ve devlet kurumlarında öğretmenlik yapmış olup şu anda akademik çalışmalarına devam etmekte olan Sema Bekiroğlu 3 çocuk annesidir.`,
    },
    {
      id: 6,
      name: 'Süleyman DULKAR',
      title: 'Muhasip',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `İstanbul Bağcılar'da doğdu. Ortaöğrenimini TOKİ Aliya İzzetbegoviç Anadolu İmam Hatip Lisesi'nde, yükseköğrenimini ise Marmara Üniversitesi Siyaset Bilimi ve Uluslararası İlişkiler Bölümü'nde tamamladı.

ÖNDER İmam Hatipliler Derneği'nde 2016'dan beri çeşitli faaliyetlerde yer aldı. 2019 yılında İstanbul Şehir Üniversitesi Kulüp Başkanı, 2020'de ÖNDER Gençlik Eğitim Koordinatörü, 2021'de ÖNDER Gençlik Üniversite Koordinatörü, Tohum Dergisi Yayın Kurulu Üyesi, 58. ve 59. Dönem ÖNDER Yönetim Kurulu Üyesi olarak görev yaptı.

Halihazırda işe alım uzmanı olarak kariyerine devam etmektedir. Lise yıllarından beri farklı STK'lar ve kurumlarla temas halinde kalarak gençlik, dergicilik ve eğitim çalışmalarında bulundu. 2013 yılından bu yana profesyonel düzeyde müzikle ilgilenmektedir.`,
    },
    {
      id: 7,
      name: 'Doç. Dr. Ahmet KOÇ',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `Doç. Dr. Ahmet Koç, din eğitimi alanında uzmanlaşmış bir akademisyendir. Lisans, yüksek lisans ve doktora derecelerini ilahiyat ve eğitim bilimleri alanlarında tamamladıktan sonra akademik kariyerine çeşitli üniversitelerde öğretim elemanı olarak devam etmiştir. Hâlen İstanbul Üniversitesi İlahiyat Fakültesi Dekan Yardımcısı ve Din Eğitimi Anabilim Dalı Başkanı görev yapmaktadır.

Akademik çalışmaları, din eğitimi, değerler eğitimi, Kuzey Kıbrıs'ta din eğitimi, din öğretiminde çağdaş ölçme ve değerlendirme teknikleri, dini alanlarda yapay zekâ kullanımı, ölçek geliştirme, erken çocuklukta din eğitimi, dijitalleşmenin din eğitimi üzerindeki etkileri ve örgün eğitimle birlikte hafızlık programları gibi geniş bir yelpazeye yayılmaktadır. Makaleleri, Sustainability, Religions, Frontiers in Psychology ve SAGE Open gibi uluslararası saygın dergilerde yayımlanmıştır. "Din Öğretiminde Alternatif Ölçme ve Değerlendirme" kitabının yanında geliştirdiği dokuz özgün ölçme aracı ve TR Dizin'de taranan pek çok dergide yayımlanmış kapsamlı araştırmaları mevcuttur.

Editöryal faaliyetleri kapsamında SAGE Open, Hitit İlahiyat Dergisi, darulfunun ilahiyat ve Yakın Doğu Üniversitesi İlahiyat Fakültesi dergilerinde editör ve yayın kurulu üyesi olarak görev yapmakta olup, "Etkili Öğretmenlik" ve "Geleceğin Öğretmenleri" isimli bilimsel araştırma projelerini de yürütmüştür. Lisans düzeyinde pedagojik formasyon derslerine, lisansüstü düzeyde ise din eğitimi anabilimdalı derslerine girmekte olup lisansüstü bir çok teze danışmanlık yapmaktadır. Aynı zamanda Kıbrıs Vakfı mütevelli ve yönetim kurulu üyesidir.`,
    },
    {
      id: 8,
      name: 'Doç. Dr. Umut KAYA',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_7.jpg',
      bio: `1981 yılında İstanbul'da doğdu. 1999'da Eyüp Anadolu İmam Hatip Lisesi'nden mezun olduktan sonra tedrisatına Marmara Üniversitesi İlahiyat Fakültesi'nde devam etti. Marmara Üniversitesi Sosyal Bilimler Enstitüsü'nde yüksek lisans (2006) ve doktora (2012) eğitimini tamamladı.

2009–2014 yılları arasında beş yıl süre ile Başbakanlık Osmanlı Arşivi'nde görev aldı. 2014 yılında ise Marmara Üniversitesi İlahiyat Fakültesi'nde Yardımcı Doçent olarak göreve başladı. 2021 yılında Doçent oldu. Halen Marmara Üniversitesi İlahiyat Fakültesi'nde bu görevini sürdürmektedir. Tanzimat'tan Cumhuriyet'e Osmanlı'da Ahlak Eğitimi adında bir eseri bulunan Kaya, din eğitimi alanında çalışmalarını sürdürmektedir.`,
    },
    {
      id: 9,
      name: 'Emine ERDOĞAN',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_1.jpg',
      bio: `İlk, orta ve lise eğitimini Kayseri'de tamamladı. Erciyes Üniversitesi ilahiyat fakültesinden 2002 yılında mezun oldu. Anadolu Üniversitesi İktisat Fakültesi Kamu Yönetimi lisans eğitimini tamamladıktan sonra aynı üniversitenin Medya ve İletişim bölümünden mezun oldu. Maltepe Üniversitesi Eğitim Yönetimi ve Denetimi alanında yüksek lisansını yaptı.

Çeşitli okullarda öğretmenlik ve idarecilik yaptı. İstanbul Pendik Sezai Karakoç İmam Hatip Ortaokulunda Okul Müdürü olarak görevini halen devam ettirmektedir. Evli ve iki çocuk annesidir. Eğitim Bir Sen 4 Nolu Şube Kadın Komisyonu Başkanlığını yürütmektedir.`,
    },
    {
      id: 10,
      name: 'Başhanım BARLIK',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_9.jpg',
      bio: `1980 yılında Adana'da doğdu. Bakırköy İmam Hatip Lisesi'nden mezun oldu. Kocaeli Üniversitesi İlahiyat Fakültesi'ni ve Eskişehir Anadolu Üniversitesi Sosyal Hizmetler bölümünü tamamladı. Öğretmenlik mesleğinde 10 yıllık bir tecrübeye sahip olup son 5 yıldır ÖNDER çatısı altında Öğretmen Komisyonu üyesi olarak görev yapmaktadır. Evli ve üç çocuk annesidir.`,
    },
    {
      id: 11,
      name: 'Rabbani BOZANCI',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `Rabbani Bozacı, lise eğitimini 2022 yılında İstanbul İmam Hatip Lisesi'nde tamamladı. Aynı yıl Marmara Üniversitesi İlahiyat Fakültesi'ne yerleşerek bir yıl Arapça hazırlık eğitimi aldı. Bu süreçte üç aylık bir dönem için Ürdün'de bulundu. Üniversite eğitimiyle eş zamanlı olarak İstanbul Eğitim ve Araştırma Merkezi (İSAR) bünyesinde iki yıl boyunca İslamî ilimler ve sosyal bilimler alanlarında seçkin hocalardan dersler aldı. İlahiyat Fakültesi birinci sınıfın sonunda Marmara Üniversitesi Hukuk Fakültesi'nde Çift Anadal Programı'na kabul edilerek eğitimine burada da devam etmeye başladı.

Hâlihazırda her iki lisans programını birlikte sürdürmektedir. Üniversite yıllarından itibaren profesyonel yazarlık eğitimleri almış; çeşitli sosyal bilim alanlarında makaleler kaleme almış ve yazmaya devam etmektedir. İslam iktisadı, eğitim ve politika başlıca ilgi alanları arasında yer almaktadır. İyi düzeyde Arapça bilmektedir.`,
    },
    {
      id: 12,
      name: 'Vildan MENTEŞ ÇETİN',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-1.jpg',
      bio: `1977 yılında İstanbul'da doğdu. Bakırköy İmam-Hatip Lisesini bitirdikten sonra Marmara Üniversitesi İlahiyat Fakültesi'nde eğitim hayatını tamamladı. Dönemin yasakları devam ederken gönüllü din hizmetleri ve çeşitli sivil toplum faaliyetlerinde yer aldı. 2005 yılında Diyanet İşleri Başkanlığına Vaiz olarak atandı. Gümüşhane ve İstanbul Müftülüklerinde görev yaptı. Dokuz yıl süren vaizlik görevi boyunca Aile İrşat ve Rehberlik faaliyetleri, engelliler ve ailelerine yönelik seminerler, Darülaceze, Çocuk Esirgeme vb kurumlarda çeşitli çalışmalar yaptı. 2013 yılında Millî Eğitim Bakanlığına Öğretmen olarak atandı. Fıkıh, eğitim, kadın ve Türk İslam sanatları alanlarında makaleleri bulunmaktadır. Aslen Kosova-Prizrenli olup evli ve beş çocuk annesidir.`,
    },
    {
      id: 13,
      name: 'Doç. Dr. Ahmet EKŞİ',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `Ahmet EKŞİ 1972 yılında Erzurum'un İspir ilçesine bağlı Çayırözü Köyü'nde doğdu. 1992 yılında Bursa Merkez İmam-Hatip Lisesi'nden mezun oldu. Aynı yıl kazandığı Marmara Üniversitesi İlahiyat Fakültesi'nden 1997'de mezun oldu. Ardından Marmara Üniversitesi Sosyal Bilimler Enstitüsünde İslam Hukuku Anabilim Dalında Yüksek Lisans öğretim programını tamamladı. Bu süre içerisinde "İslam Hukukunda Mağdurun Rızasının Hukuka Aykırılığa Etkisi ve Sorumluluk Bakımından Sonuçları" adlı Yüksek Lisans Tezini hazırladı.

22 Aralık 1998 yılında İstanbul Güngören Haznedar A. İpekçi İÖO'da Din Kültürü ve Ahlak Bilgisi öğretmeni olarak göreve başladı. Yedi yıl öğretmenlik yaptıktan sonra 2006 yılında Milli Eğitim Bakanlığı Din Öğretimi Genel Müdürlüğü tarafından ders kitaplarını yazım komisyonunda görevlendirildi. Bu süre içerisinde komisyonda yer alan diğer öğretmenlerle birlikte önce İlköğretim ve Lise Din Kültürü ve Ahlak Bilgisi ders kitapları ile Öğretmen Kılavuz kitaplarını yazdılar. Ardından İmam-Hatip Lisesi Meslek derslerinin kitaplarını hazırladılar. Yine aynı süre içerisinde Batı Trakya Türklerinin okullarında okutulacak olan ilkokul, ortaokul ve lise ders kitaplarının hazırlanmasında çalıştı. 2010 Yılında Selçuk Üniversitesi'nde İslam Hukuku alanında "İslam Hukukunda Tıbbi Müdahalelerden Doğan Hukuki Sorumluluk" adlı teziyle doktora ünvanını aldı. Mart 2012'de Yıldız Teknik Üniversitesi Eğitim Fakültesi DKAB Bölümüne Yrd. Doç. Olarak atandı. Üç yıl görev yaptıktan sonra Kocaeli Üniversitesi İlahiyat Fakültesine naklini aldırdı. 2020'de Doçent oldu. Halen Kocaeli Üniversitesi İlahiyat Fakültesi Temel İslam Bilimleri Anabilim Dalı İslam Hukuku'nda öğretim üyesi olarak görev yapmaktadır. Yazdığı ders kitaplarının yanı sıra birçok kitap ile ulusal ve uluslararası hakemli dergilerde yayınlanmış makalesi bulunmaktadır. Evli ve iki çocuk babası olup Arapça ve İngilizce bilmektedir.`,
    },
  ];

  const supervisionMembers = [
    {
      id: 14,
      name: 'Resul ÇİFTÇİ',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_4.jpg',
      bio: `1994 yılında Giresun'un Şebinkarahisar ilçesinde doğdu. İlk ve ortaokulu Şebinkarahisar'da tamamladı. 2012 yılında İstanbul Kartal Anadolu İmam Hatip Lisesi'nden 2017 yılında da İstanbul Üniversitesi İlahiyat Fakültesi'nden mezun oldu.

Lise ve üniversite yıllarında birçok dernek ve vakıfta gönüllü çalışmalar içerisinde yer aldı. İLKE Vakfı çatısı altında Geleceğin Türkiye'si Raporları kapsamında Araştırmacı olarak çalıştı.

İş hayatına Türkiye Katılım Sigorta şirketinde Stratejik Planlama Yöneticisi olarak devam etmektedir. Aynı zamanda 2024 Ekim ayı itibariyle Türkiye Badminton Federasyonu Yönetim Kurulu Üyesi olarak seçilmiştir.

Çiftci, 2015 yılında kurulan ÖNDER Gençlik Komisyonu'nda bulundu. 2018 ile 2022 yılları arasında ÖNDER Gençlik Komisyonu Başkanlığını yürüttü. Halen ÖNDER Genel Başkan Danışmanlığı görevini aktif olarak ifa etmektedir.`,
    },
    {
      id: 15,
      name: 'Recep YEŞİLKAYA',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `İbn Haldun Üniversitesi'nde Siyaset Bilimi ve Uluslararası İlişkiler ile İslami İlimler bölümlerinde çift anadal yapmaktadır.

2021 yılında ÖNDER Gençlik'te çeşitli koordinatörlükler üstlenmiş, son olarak Gençlik Teşkilat biriminde görev almıştır. 2024 yılında Ürdün'de bulunan World Islamic Science and Education University'de Arapça dil eğitimi almıştır.`,
    },
    {
      id: 16,
      name: 'Prof. Dr. Ahmet TÜRKAN',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `1976 yılında Düzce'de doğdu. 1994 yılında Düzce İmam Hatip Lisesinden, 2000 yılında Selçuk Üniversitesi İlahiyat Fakültesi'nden mezun oldu. Selçuk Üniversitesi Sosyal Bilimler Enstitüsü Felsefe ve Din Bilimleri Anabilim Dalı Dinler Tarihi bilim dalında 2003 yılında Yüksek Lisansını ve 2011 yılında Doktorasını tamamladı.

2013 yılında Dumlupınar Üniversitesi İlahiyat Fakültesi Felsefe ve Din Bilimleri Bölümü Dinler Tarihi Anabilim Dalında Doktor Öğretim Üyesi olarak göreve başladı, 2018 yılında doçent ve 2023 yılında profesör oldu. Dumlupınar Üniversitesi Senato üyeliği ve Kütüphane Daire Başkanı görevlerinin yanında aynı üniversitenin İlahiyat Fakültesinde Felsefe ve Din Bilimleri Bölüm Başkanlığı ve Dekan Yardımcılığı yaptı. 2021 yılında Necmettin Erbakan Üniversitesi Ahmet Keleşoğlu İlahiyat Fakültesinde Dinler Tarihi Anabilim Dalında göreve başladı. Ahmet TÜRKAN halen NEÜ Ahmet Keleşoğlu İlahiyat Fakültesi'nde Dinler Tarihi anabilim dalı başkanlığının yanı sıra NEÜ Kurumsal Kalite ve Akreditasyon koordinatörü olarak görevini sürdürmektedir.`,
    },
    {
      id: 17,
      name: 'Doç. Dr. Ahmet MEYDAN',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `05.12.1973 tarihinde Erzincan'da doğdu. İlkokuldan sonra Bayrampaşa Yeşil Cami Kur'an Kursu'nda hafızlık yaptı. Aynı yerde Arapça Gramer ve Dini İlimler okudu. Dışarıdan sınavları vererek ortaokul ve lise diploması aldı. 1997 yılında Marmara Üniversitesi İlahiyat Fakültesi'nden mezun olduktan sonra "İslam Hukukunda Muvâzaa Kavramı" başlıklı teziyle yüksek lisansını (2006), "Kutbüddîn-i Şîrâzî'nin Miftâhu'l-Miftâh Adlı Eserinin Tahkik ve Tahlili" başlıklı teziyle de doktorasını tamamladı (2019).

Milli Eğitim Bakanlığı'nda öğretmen olarak ve Din Kültürü ve Ahlak Bilgisi ile İHL Meslek dersleri ders kitapları yazım komisyonunda da yazar olarak görev yaptı. Diğer taraftan tercüme eserlerinin yanı sıra gençlere ve ailelere yönelik çok sayıda eser telif etti. 2012-2023 yılları arasında Yalova Üniversitesi İslami İlimler Fakültesi'nde öğretim görevlisi ve öğretim üyesi olarak çalıştı. 2023 yılından itibaren görevine devam etmektedir.`,
    },
    {
      id: 18,
      name: 'Yunus Vehbi KARAMAN',
      title: 'Üye',
      image: 'https://ihamer.org.tr/wp-content/uploads/2025/09/ihamer_5-100.jpg',
      bio: `Lisans eğitimini Samsun Ondokuz Mayıs Üniversitesi Eğitim Fakültesi'nde aldı. Yüksek lisans eğitimini 2020 yılında İstanbul Sabahattin Zaim Üniversitesi Sosyoloji Bölümü'nde tamamladı.

Halihazırda İstanbul Medeniyet Üniversitesi Sosyoloji Bölümü'nde doktora eğitimine devam etmektedir. Toplumsal hareketler, toplumsal değişim, eğitim, tabakalaşma ve sosyal hareketlilik alanlarına ilgi duymaktadır.`,
    },
  ];


  const MemberCard = ({ member }) => (
    <div
      onClick={() => member.bio && setSelectedMember(member)}
      className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 flex flex-col h-full ${
        member.bio
          ? 'cursor-pointer hover:-translate-y-2'
          : ''
      }`}
    >
      {/* Resim Alanı */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        {/* Modern Overlay Efekti */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Hover İkonu */}
        {member.bio && (
            <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
            </div>
        )}
      </div>

      {/* İçerik Alanı */}
      <div className="p-5 text-center flex-1 flex flex-col justify-start pt-6">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-yellow-700 transition-colors duration-300 mb-1 leading-tight">
          {member.name}
        </h3>
        
        {/* Dekoratif Çizgi */}
        <div className="w-8 h-1 bg-yellow-600 rounded-full mx-auto my-3 group-hover:w-16 group-hover:bg-yellow-700 transition-all duration-300"></div>
        
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {member.title}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wrapper Section (ORİJİNAL HALİYLE KORUNDU) */}
      <div 
        className="w-full px-5 h-[220px] relative flex flex-col md:justify-start md:items-start justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/public/kurumsal/assest/wrapper-2.png')"
        }}
      >
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        
        <div className="relative z-[2] text-white md:text-left text-center">
          <p className="text-white text-4xl font-black mt-2.5 text-center md:text-left mb-7 mt-14">Yönetim Kurulu</p>
          <h1 className="mt-2">
            <a href="/" className="text-white no-underline font-bold text-xl hover:opacity-80 transition-opacity">
              <span>Anasayfa</span>
              <i className="fas fa-angle-right text-[0.8rem] mx-2"></i>
            </a>
            <a href="/yonetim" className="text-white no-underline font-bold hover:opacity-80 text-xl">
              <span>Yönetim Kurulu</span>
            </a>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Yönetim Kurulu Members - GRID YAPISI AYNEN KORUNDU */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 mb-16">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* Denetleme Kurulu Section - Daha şık bir ayraç */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <h2 className="bg-gray-50 px-8 text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Denetleme Kurulu
            </h2>
          </div>
        </div>

        {/* Supervision Members - GRID YAPISI AYNEN KORUNDU */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {supervisionMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Modal - Modernize Edildi */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gray-50 border-b border-gray-100 p-6 flex items-start gap-4">
               <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-white"
                />
                <div className="flex-1 pt-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                        {selectedMember.name}
                    </h3>
                    <p className="text-yellow-600 font-medium mt-1">
                        {selectedMember.title}
                    </p>
                </div>
                <button
                    onClick={() => setSelectedMember(null)}
                    className="p-2 bg-white hover:bg-red-50 hover:text-red-500 rounded-full transition-colors border border-gray-200 shadow-sm"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="text-base text-gray-600 leading-relaxed space-y-4 text-justify">
                {selectedMember.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardMembers;