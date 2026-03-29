export interface Identitas {
  namaSekolah: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  mataPelajaran: string;
  kelasSemester: string;
  alokasiWaktu: string; // e.g., "4 JP"
  fase?: string;
}

export interface UserInput extends Identitas {
  modelPembelajaran: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  instruksiTambahan: string;
}

export interface KesiapanPesertaDidik {
  pengetahuanAwal: string;
  minat: string;
  latarBelakang: string;
  kebutuhanBelajar: string;
}

export interface KarakteristikMateri {
  jenisPengetahuan: string;
  relevansi: string;
  tingkatKesulitan: string;
  strukturMateri: string;
  integrasiNilai: string;
}

export interface DesainPembelajaran {
  capaianPembelajaran: string;
  lintasDisiplin: string;
  tujuanPembelajaranUmum: string;
  topikPembelajaran: string;
  kerangkaPembelajaran: {
    praktikPedagogis: string;
    kemitraanPembelajaran: string;
    lingkunganPembelajaran: string;
    pemanfaatanDigital: string;
  };
  langkahLangkah: Pertemuan[];
  asesmen: {
    awal: string;
    proses: string;
    hasil: string;
  };
}

export interface Pertemuan {
  pertemuanKe: number;
  tujuanPembelajaranSpesifik: string;
  pendahuluan: {
    kegiatan: string[];
    waktu: string;
    prinsip: string; // Berkesadaran
  };
  inti: {
    kegiatan: string[];
    waktu: string;
    prinsip: string; // Bermakna
  };
  penutup: {
    kegiatan: string[];
    waktu: string;
    prinsip: string; // Menggembirakan
  };
}

export interface RPPData {
  identitas: Identitas;
  kesiapanPesertaDidik: KesiapanPesertaDidik;
  karakteristikMateri: KarakteristikMateri;
  dimensiProfilPelajar: {
    nama: string;
    terpilih: boolean;
  }[];
  desainPembelajaran: DesainPembelajaran;
}
