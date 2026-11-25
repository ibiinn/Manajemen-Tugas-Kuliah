-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "nim" VARCHAR(15) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jurusan" VARCHAR(50) NOT NULL,
    "angkatan" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_nim_key" ON "students"("nim");
