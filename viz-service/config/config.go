package config

import (
	"os"
)

type Config struct {
	ReactAppUrl string
	DbEndpoint  string
	DbName      string
	DbARN       string
	DbPort      string
	DbUser      string
	DbPassword  string
}

func Load() *Config {
	return &Config{
		ReactAppUrl: os.Getenv("REACT_APP_URL"),
		DbEndpoint:  os.Getenv("DB_ENDPOINT"),
		DbName:      os.Getenv("DB_NAME"),
		DbARN:       os.Getenv("DB_ARN"),
		DbPort:      os.Getenv("DB_PORT"),
		DbUser:      os.Getenv("DB_USER"),
		DbPassword:  os.Getenv("DbPassword"),
	}
}
