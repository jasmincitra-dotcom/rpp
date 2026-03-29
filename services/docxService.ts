
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
} from "docx";
import { RPPData } from "../types";

// Fungsi bantu untuk konversi CM ke Twips (1 inch = 1440 twips = 2.54 cm)
// 1 cm = 1440 / 2.54 = 566.929 twips
const cmToTwips = (cm: number) => Math.round(cm * 566.929);

// Dimensi standar A4 dalam Twips
const A4_WIDTH = 11906; // 21 cm
const A4_HEIGHT = 16838; // 29.7 cm

export const generateDocx = async (data: RPPData): Promise<Blob> => {
  const { identitas, kesiapanPesertaDidik, karakteristikMateri, dimensiProfilPelajar, desainPembelajaran } = data;

  const DEFAULT_FONT = "Times New Roman";
  const DEFAULT_SIZE = 24; // 12pt = 24 half-points

  const createHeading = (text: string, level = HeadingLevel.HEADING_1) => {
    return new Paragraph({
      heading: level,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: text,
          font: DEFAULT_FONT,
          size: DEFAULT_SIZE,
          bold: true,
        }),
      ],
    });
  };

  const createText = (text: string, bold = false) => {
    return new Paragraph({
      children: [new TextRun({ text, bold, font: DEFAULT_FONT, size: DEFAULT_SIZE })],
      spacing: { after: 100 },
    });
  };

  const createLabelValue = (label: string, value: string) => {
    return new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, font: DEFAULT_FONT, size: DEFAULT_SIZE }),
        new TextRun({ text: value || "", font: DEFAULT_FONT, size: DEFAULT_SIZE }),
      ],
      spacing: { after: 50 },
    });
  };

  const createBulletList = (items: string[]) => {
    return (items || []).map(
      (item) =>
        new Paragraph({
          children: [new TextRun({ text: item, font: DEFAULT_FONT, size: DEFAULT_SIZE })],
          bullet: { level: 0 },
        })
    );
  };

  const profilLulusanParagraphs = (dimensiProfilPelajar || []).map((d) => 
    new Paragraph({
      children: [
        new TextRun({ text: d.terpilih ? "[x] " : "[ ] ", font: "Courier New", size: DEFAULT_SIZE }),
        new TextRun({ text: d.nama, font: DEFAULT_FONT, size: DEFAULT_SIZE, color: d.terpilih ? "000000" : "888888" }),
      ],
      spacing: { after: 50 },
    })
  );

  const steps = (desainPembelajaran?.langkahLangkah || []).flatMap((pertemuan) => {
    const pendahuluanPrinsip = pertemuan.pendahuluan?.prinsip || "Berkesadaran";
    const pendahuluanKegiatan = pertemuan.pendahuluan?.kegiatan || [];
    
    const intiPrinsip = pertemuan.inti?.prinsip || "Bermakna";
    const intiKegiatan = pertemuan.inti?.kegiatan || [];

    const penutupPrinsip = pertemuan.penutup?.prinsip || "Menggembirakan";
    const penutupKegiatan = pertemuan.penutup?.kegiatan || [];

    return [
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `Pertemuan Ke-${pertemuan.pertemuanKe}`,
            font: DEFAULT_FONT,
            size: DEFAULT_SIZE,
            bold: true,
          })
        ]
      }),
      createLabelValue("Tujuan Spesifik", pertemuan.tujuanPembelajaranSpesifik || ""),
      new Paragraph({
        children: [
          new TextRun({
            text: "A. Pendahuluan (15 Menit) - " + pendahuluanPrinsip,
            bold: true,
            font: DEFAULT_FONT,
            size: DEFAULT_SIZE,
          }),
        ],
        spacing: { before: 100 },
      }),
      ...createBulletList(pendahuluanKegiatan),
      new Paragraph({
        children: [
          new TextRun({
            text: "B. Inti (60 Menit) - " + intiPrinsip,
            bold: true,
            font: DEFAULT_FONT,
            size: DEFAULT_SIZE,
          }),
        ],
        spacing: { before: 100 },
      }),
      ...createBulletList(intiKegiatan),
      new Paragraph({
        children: [
          new TextRun({
            text: "C. Penutup (15 Menit) - " + penutupPrinsip,
            bold: true,
            font: DEFAULT_FONT,
            size: DEFAULT_SIZE,
          }),
        ],
        spacing: { before: 100 },
      }),
      ...createBulletList(penutupKegiatan),
    ];
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: DEFAULT_SIZE,
            font: DEFAULT_FONT,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: A4_WIDTH,
              height: A4_HEIGHT,
            },
            margin: {
              top: cmToTwips(4),
              right: cmToTwips(4),
              bottom: cmToTwips(3),
              left: cmToTwips(3),
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "RENCANA PELAKSANAAN PEMBELAJARAN (RPP)",
                bold: true,
                font: DEFAULT_FONT,
                size: 28, // Judul sedikit lebih besar
              }),
            ],
          }),
          
          createHeading("A. IDENTITAS MODUL"),
          createLabelValue("Nama Sekolah", identitas.namaSekolah),
          createLabelValue("Nama Penyusun", `${identitas.namaGuru} (NIP: ${identitas.nipGuru || "-"})`),
          createLabelValue("Kepala Sekolah", `${identitas.namaKepalaSekolah} (NIP: ${identitas.nipKepalaSekolah || "-"})`),
          createLabelValue("Mata Pelajaran", identitas.mataPelajaran),
          createLabelValue("Kelas / Semester", identitas.kelasSemester),
          createLabelValue("Alokasi Waktu", identitas.alokasiWaktu),

          createHeading("B. IDENTIFIKASI KESIAPAN PESERTA DIDIK"),
          createLabelValue("Pengetahuan Awal", kesiapanPesertaDidik?.pengetahuanAwal || "-"),
          createLabelValue("Minat", kesiapanPesertaDidik?.minat || "-"),
          createLabelValue("Latar Belakang", kesiapanPesertaDidik?.latarBelakang || "-"),
          createLabelValue("Kebutuhan Belajar", kesiapanPesertaDidik?.kebutuhanBelajar || "-"),

          createHeading("C. KARAKTERISTIK MATERI PELAJARAN"),
          createLabelValue("Jenis Pengetahuan", karakteristikMateri?.jenisPengetahuan || "-"),
          createLabelValue("Relevansi", karakteristikMateri?.relevansi || "-"),
          createLabelValue("Tingkat Kesulitan", karakteristikMateri?.tingkatKesulitan || "-"),
          createLabelValue("Struktur Materi", karakteristikMateri?.strukturMateri || "-"),
          createLabelValue("Integrasi Nilai", karakteristikMateri?.integrasiNilai || "-"),

          createHeading("D. DIMENSI PROFIL LULUSAN"),
          ...(profilLulusanParagraphs.length > 0 ? profilLulusanParagraphs : [createText("Tidak ada dimensi spesifik terpilih.")]),

          createHeading("E. DESAIN PEMBELAJARAN"),
          createHeading("1. Capaian Pembelajaran", HeadingLevel.HEADING_2),
          createText(desainPembelajaran?.capaianPembelajaran || "-"),
          
          createHeading("2. Lintas Disiplin Ilmu", HeadingLevel.HEADING_2),
          createText(desainPembelajaran?.lintasDisiplin || "-"),
          
          createHeading("3. Tujuan Pembelajaran", HeadingLevel.HEADING_2),
          createText(desainPembelajaran?.tujuanPembelajaranUmum || "-"),
          
          createHeading("4. Topik Pembelajaran Kontekstual", HeadingLevel.HEADING_2),
          createText(desainPembelajaran?.topikPembelajaran || "-"),
          
          createHeading("5. Kerangka Pembelajaran", HeadingLevel.HEADING_2),
          createLabelValue("Praktik Pedagogis", desainPembelajaran?.kerangkaPembelajaran?.praktikPedagogis || "-"),
          createLabelValue("Kemitraan Pembelajaran", desainPembelajaran?.kerangkaPembelajaran?.kemitraanPembelajaran || "-"),
          createLabelValue("Lingkungan Pembelajaran", desainPembelajaran?.kerangkaPembelajaran?.lingkunganPembelajaran || "-"),
          createLabelValue("Pemanfaatan Digital", desainPembelajaran?.kerangkaPembelajaran?.pemanfaatanDigital || "-"),

          createHeading("F. LANGKAH-LANGKAH PEMBELAJARAN"),
          ...steps,

          createHeading("G. ASESMEN PEMBELAJARAN"),
          createHeading("1. Asesmen Awal (Diagnostic)", HeadingLevel.HEADING_3),
          createText(desainPembelajaran?.asesmen?.awal || "-"),
          createHeading("2. Asesmen Proses (Formative)", HeadingLevel.HEADING_3),
          createText(desainPembelajaran?.asesmen?.proses || "-"),
          createHeading("3. Asesmen Hasil (Summative)", HeadingLevel.HEADING_3),
          createText(desainPembelajaran?.asesmen?.hasil || "-"),
          
          // Tanda Tangan
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({ 
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "Mengetahui,", font: DEFAULT_FONT, size: DEFAULT_SIZE })] 
                                }),
                                new Paragraph({ 
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "Kepala Sekolah", font: DEFAULT_FONT, size: DEFAULT_SIZE })] 
                                }),
                                new Paragraph({ text: "", spacing: { before: 800 } }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: identitas.namaKepalaSekolah,
                                            bold: true,
                                            underline: { type: "single", color: "auto" },
                                            font: DEFAULT_FONT,
                                            size: DEFAULT_SIZE,
                                        }),
                                    ],
                                }),
                                new Paragraph({ 
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: `NIP. ${identitas.nipKepalaSekolah || "-"}`, font: DEFAULT_FONT, size: DEFAULT_SIZE })] 
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({ 
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: "Guru Mata Pelajaran", font: DEFAULT_FONT, size: DEFAULT_SIZE })] 
                                }),
                                new Paragraph({ text: "", spacing: { before: 800 } }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: identitas.namaGuru,
                                            bold: true,
                                            underline: { type: "single", color: "auto" },
                                            font: DEFAULT_FONT,
                                            size: DEFAULT_SIZE,
                                        }),
                                    ],
                                }),
                                new Paragraph({ 
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text: `NIP. ${identitas.nipGuru || "-"}`, font: DEFAULT_FONT, size: DEFAULT_SIZE })] 
                                }),
                            ],
                        }),
                    ],
                }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};
