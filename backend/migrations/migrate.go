package migrations

import (
	"fmt"
	"sharing-vision/backend/config"
	"sharing-vision/backend/models"
)

func Migrate() {
	err := config.DB.AutoMigrate(&models.Post{})
	if err != nil {
		panic("migrate gagal: " + err.Error())
	}
	fmt.Println("migrate selesai")
}
