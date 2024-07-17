-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('STUDENT_UNION_1_FLOOR_1', 'STUDENT_UNION_1_FLOOR_2', 'STUDENT_UNION_2_FLOOR_1', 'STUDENT_UNION_2_FLOOR_2');

-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('BREAKFAST', 'LUNCH', 'LUNCH_SPECTICAL', 'DINNER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('KOREAN', 'ENGLISH');

-- CreateTable
CREATE TABLE "menu" (
    "id" SERIAL NOT NULL,
    "type" "MenuType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "building_type" "BuildingType" NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_name" (
    "food_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "food_name_pkey" PRIMARY KEY ("food_id","language")
);

-- CreateTable
CREATE TABLE "_FoodToMenu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToMenu_AB_unique" ON "_FoodToMenu"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToMenu_B_index" ON "_FoodToMenu"("B");

-- AddForeignKey
ALTER TABLE "food_name" ADD CONSTRAINT "food_name_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToMenu" ADD CONSTRAINT "_FoodToMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToMenu" ADD CONSTRAINT "_FoodToMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
