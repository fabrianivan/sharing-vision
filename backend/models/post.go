package models

import "time"

type Post struct {
	Id          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"type:varchar(200)"`
	Content     string    `json:"content" gorm:"type:text"`
	Category    string    `json:"category" gorm:"type:varchar(100)"`
	CreatedDate time.Time `json:"created_date" gorm:"column:Created_date;autoCreateTime"`
	UpdatedDate time.Time `json:"updated_date" gorm:"column:Updated_date;autoUpdateTime"`
	Status      string    `json:"status" gorm:"type:varchar(100)"`
}

func (Post) TableName() string {
	return "posts"
}
