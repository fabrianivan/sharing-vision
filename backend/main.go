package main

import (
	"log"
	"os"

	"sharing-vision/backend/config"
	"sharing-vision/backend/handlers"
	"sharing-vision/backend/migrations"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	migrations.Migrate()

	r := gin.Default()

	// setting cors - allow semua origin buat cloud run
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
	}))

	// routes
	r.POST("/article/", handlers.CreateArticle)
	r.GET("/article/:id/:offset", handlers.GetArticles)
	r.GET("/article/:id", handlers.GetArticleByID)
	r.PUT("/article/:id", handlers.UpdateArticle)
	r.PATCH("/article/:id", handlers.UpdateArticle)
	r.DELETE("/article/:id", handlers.DeleteArticle)

	// cloud run pake env PORT
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("server jalan di :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("server gagal start:", err)
	}
}
