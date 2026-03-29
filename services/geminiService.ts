
import { GoogleGenAI, Type } from "@google/genai";
import { RPPData, UserInput } from "../types";

const SYSTEM_INSTRUCTION = `
Anda adalah ahli pengembang kurikulum pendidikan Indonesia yang mengkhususkan diri pada kerangka kerja 'Pembelajaran Mendalam' (Deep Learning). 
Tugas Anda adalah membuat Rencana Pelaksanaan Pembelajaran (RPP) yang lengkap, detail, dan profesional berdasarkan input pengguna.

ATURAN STRUKTUR RPP:
1.  **Identitas**: Sesuai input pengguna.
2.  **Identifikasi Kesiapan Peserta Didik**: Analisis prediktif berdasarkan materi (Pengetahuan Awal, Minat, Latar Belakang, Kebutuhan Belajar).
3.  **Karakteristik Materi Pelajaran**: Jenis Pengetahuan, Relevansi dengan Kehidupan Nyata, Tingkat Kesulitan, Struktur Materi, Integrasi Nilai dan Karakter.
4.  **Dimensi Profil Lulusan**:
    *   Gunakan TEPAT 8 DIMENSI berikut: Keimanan & Ketakwaan, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, dan Komunikasi.
    *   Set 'terpilih': true pada dimensi yang paling dikuatkan dalam pembelajaran ini, sisanya false.
5.  **Desain Pembelajaran**:
    *   **Capaian Pembelajaran**: Sesuai input.
    *   **Lintas Disiplin Ilmu**: Hubungkan dengan mata pelajaran lain yang relevan sesuai karakteristik topik.
    *   **Tujuan Pembelajaran**: Kembangkan dari input pengguna. Pecah TP ini agar sesuai dengan alokasi waktu dan topik per pertemuan.
    *   **Topik Pembelajaran Kontekstual**: Topik yang relevan.
    *   **Kerangka Pembelajaran (Deep Learning)**:
        *   *Praktik Pedagogis*: Wajib pendekatan mendalam (Inkuiri/PBL/PjBL).
        *   *Kemitraan Pembelajaran*: Pelibatan pihak luar.
        *   *Lingkungan Pembelajaran*: Fisik & Virtual.
        *   *Pemanfaatan Digital*: AI, AR, dsb.
    *   **Langkah-langkah Pembelajaran**:
        *   **ALOKASI WAKTU**: 1 Pertemuan = 2 JP (2 x 45 Menit). Hitung jumlah pertemuan berdasarkan input.
        *   **SEKUENSIAL TOPIK**: Bahas SATU topik/sub-topik materi sampai tuntas sebelum lanjut ke topik berikutnya.
        *   **SINTAK MODEL PEMBELAJARAN (WAJIB EKSPLISIT)**: Pada bagian Kegiatan Inti, TULISKAN NAMA FASE/SINTAK secara lengkap (Contoh: "Fase 1: Orientasi Masalah"). JANGAN hanya menulis angka atau Step.
        *   Setiap pertemuan memiliki struktur: Pembukaan (15 menit), Inti (60 menit), Penutup (15 menit).
    *   **Asesmen Pembelajaran**:
        *   *Asesmen Awal*: Kesiapan belajar & diagnostik.
        *   *Asesmen Proses*: Assessment for & as learning (Peer/Self assessment).
        *   *Asesmen Hasil*: Assessment of learning (Produk/Tes).

OUTPUT HARUS DALAM FORMAT JSON SESUAI SCHEMA.
`;

export const generateRPP = async (input: UserInput): Promise<RPPData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Buatkan RPP dengan data berikut:
    Nama Sekolah: ${input.namaSekolah}
    Guru: ${input.namaGuru} (NIP: ${input.nipGuru})
    Kepala Sekolah: ${input.namaKepalaSekolah} (NIP: ${input.nipKepalaSekolah})
    Mapel: ${input.mataPelajaran}
    Kelas/Semester: ${input.kelasSemester}
    Alokasi Waktu: ${input.alokasiWaktu}
    Model Pembelajaran: ${input.modelPembelajaran}
    CP: ${input.capaianPembelajaran}
    TP: ${input.tujuanPembelajaran}
    Instruksi Tambahan: ${input.instruksiTambahan}

    Instruksi Khusus:
    1. Pecah langkah pembelajaran menjadi beberapa pertemuan (masing-masing 2JP).
    2. Gunakan 8 Dimensi Profil Lulusan berikut: Keimanan & Ketakwaan, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, dan Komunikasi. Tandai yang relevan.
    3. Tuliskan nama sintak model pembelajaran dengan lengkap di bagian inti.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identitas: {
            type: Type.OBJECT,
            properties: {
              namaSekolah: { type: Type.STRING },
              namaGuru: { type: Type.STRING },
              nipGuru: { type: Type.STRING },
              namaKepalaSekolah: { type: Type.STRING },
              nipKepalaSekolah: { type: Type.STRING },
              mataPelajaran: { type: Type.STRING },
              kelasSemester: { type: Type.STRING },
              alokasiWaktu: { type: Type.STRING },
            },
            required: ["namaSekolah", "namaGuru"],
          },
          kesiapanPesertaDidik: {
            type: Type.OBJECT,
            properties: {
              pengetahuanAwal: { type: Type.STRING },
              minat: { type: Type.STRING },
              latarBelakang: { type: Type.STRING },
              kebutuhanBelajar: { type: Type.STRING },
            },
            required: ["pengetahuanAwal", "minat", "latarBelakang", "kebutuhanBelajar"],
          },
          karakteristikMateri: {
            type: Type.OBJECT,
            properties: {
              jenisPengetahuan: { type: Type.STRING },
              relevansi: { type: Type.STRING },
              tingkatKesulitan: { type: Type.STRING },
              strukturMateri: { type: Type.STRING },
              integrasiNilai: { type: Type.STRING },
            },
            required: ["jenisPengetahuan", "relevansi", "tingkatKesulitan", "strukturMateri", "integrasiNilai"],
          },
          dimensiProfilPelajar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nama: { type: Type.STRING },
                terpilih: { type: Type.BOOLEAN },
              },
            },
          },
          desainPembelajaran: {
            type: Type.OBJECT,
            properties: {
              capaianPembelajaran: { type: Type.STRING },
              lintasDisiplin: { type: Type.STRING },
              tujuanPembelajaranUmum: { type: Type.STRING },
              topikPembelajaran: { type: Type.STRING },
              kerangkaPembelajaran: {
                type: Type.OBJECT,
                properties: {
                  praktikPedagogis: { type: Type.STRING },
                  kemitraanPembelajaran: { type: Type.STRING },
                  lingkunganPembelajaran: { type: Type.STRING },
                  pemanfaatanDigital: { type: Type.STRING },
                },
                required: ["praktikPedagogis", "kemitraanPembelajaran", "lingkunganPembelajaran", "pemanfaatanDigital"],
              },
              langkahLangkah: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pertemuanKe: { type: Type.INTEGER },
                    tujuanPembelajaranSpesifik: { type: Type.STRING },
                    pendahuluan: {
                      type: Type.OBJECT,
                      properties: {
                        kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        waktu: { type: Type.STRING },
                        prinsip: { type: Type.STRING },
                      },
                      required: ["kegiatan", "waktu", "prinsip"],
                    },
                    inti: {
                      type: Type.OBJECT,
                      properties: {
                        kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        waktu: { type: Type.STRING },
                        prinsip: { type: Type.STRING },
                      },
                      required: ["kegiatan", "waktu", "prinsip"],
                    },
                    penutup: {
                      type: Type.OBJECT,
                      properties: {
                        kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        waktu: { type: Type.STRING },
                        prinsip: { type: Type.STRING },
                      },
                      required: ["kegiatan", "waktu", "prinsip"],
                    },
                  },
                  required: ["pertemuanKe", "tujuanPembelajaranSpesifik", "pendahuluan", "inti", "penutup"],
                },
              },
              asesmen: {
                type: Type.OBJECT,
                properties: {
                  awal: { type: Type.STRING },
                  proses: { type: Type.STRING },
                  hasil: { type: Type.STRING },
                },
                required: ["awal", "proses", "hasil"],
              },
            },
            required: ["capaianPembelajaran", "lintasDisiplin", "tujuanPembelajaranUmum", "topikPembelajaran", "kerangkaPembelajaran", "langkahLangkah", "asesmen"],
          },
        },
        required: [
          "identitas",
          "kesiapanPesertaDidik",
          "karakteristikMateri",
          "dimensiProfilPelajar",
          "desainPembelajaran",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("No content generated");
  }

  return JSON.parse(response.text) as RPPData;
};
