package handlers

import (
	"net/http"
	"strconv"

	"sharing-vision/backend/config"
	"sharing-vision/backend/models"
	"sharing-vision/backend/validators"

	"github.com/gin-gonic/gin"
)

type ArticleInput struct {
	Title    string `json:"title"`
	Content  string `json:"content"`
	Category string `json:"category"`
	Status   string `json:"status"`
}

func CreateArticle(c *gin.Context) {
	var body ArticleInput
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "request body tidak valid"})
		return
	}

	errs := validators.ValidateArticle(body.Title, body.Content, body.Category, body.Status)
	if len(errs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
		return
	}

	newPost := models.Post{
		Title:    body.Title,
		Content:  body.Content,
		Category: body.Category,
		Status:   validators.NormalizeStatus(body.Status),
	}

	if err := config.DB.Create(&newPost).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal simpan artikel"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{})
}

// ambil list artikel pake pagination
func GetArticles(c *gin.Context) {
	// param pertama = limit (pake nama :id karena constraint gin router)
	lim, err := strconv.Atoi(c.Param("id"))
	if err != nil || lim < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "limit tidak valid"})
		return
	}

	off, err := strconv.Atoi(c.Param("offset"))
	if err != nil || off < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "offset tidak valid"})
		return
	}

	var posts []models.Post
	config.DB.Order("Created_date DESC").Limit(lim).Offset(off).Find(&posts)

	c.JSON(http.StatusOK, posts)
}

func GetArticleByID(c *gin.Context) {
	articleId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, articleId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "artikel tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func UpdateArticle(c *gin.Context) {
	articleId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, articleId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "artikel tidak ditemukan"})
		return
	}

	var body ArticleInput
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "request body tidak valid"})
		return
	}

	errs := validators.ValidateArticle(body.Title, body.Content, body.Category, body.Status)
	if len(errs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
		return
	}

	post.Title = body.Title
	post.Content = body.Content
	post.Category = body.Category
	post.Status = validators.NormalizeStatus(body.Status)

	config.DB.Save(&post)
	c.JSON(http.StatusOK, gin.H{})
}

func DeleteArticle(c *gin.Context) {
	articleId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, articleId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "artikel tidak ditemukan"})
		return
	}

	config.DB.Delete(&post)
	c.JSON(http.StatusOK, gin.H{})
}
