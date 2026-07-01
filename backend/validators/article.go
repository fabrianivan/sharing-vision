package validators

import (
	"strings"
)

type ErrValidation struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func ValidateArticle(title, content, category, status string) []ErrValidation {
	var errs []ErrValidation

	if len(strings.TrimSpace(title)) < 20 {
		errs = append(errs, ErrValidation{
			Field:   "title",
			Message: "Title minimal 20 karakter",
		})
	}

	if len(strings.TrimSpace(content)) < 200 {
		errs = append(errs, ErrValidation{
			Field:   "content",
			Message: "Content minimal 200 karakter",
		})
	}

	if len(strings.TrimSpace(category)) < 3 {
		errs = append(errs, ErrValidation{
			Field:   "category",
			Message: "Category minimal 3 karakter",
		})
	}

	// cek status valid atau engga
	allowed := map[string]bool{"publish": true, "draft": true, "thrash": true}
	s := strings.ToLower(strings.TrimSpace(status))
	if !allowed[s] {
		errs = append(errs, ErrValidation{
			Field:   "status",
			Message: "Status harus publish, draft, atau thrash",
		})
	}

	return errs
}

func NormalizeStatus(status string) string {
	s := strings.ToLower(strings.TrimSpace(status))
	switch s {
	case "publish":
		return "Publish"
	case "draft":
		return "Draft"
	case "thrash":
		return "Thrash"
	}
	return status
}
