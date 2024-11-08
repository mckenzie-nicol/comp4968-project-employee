package config

import (
	"os"
)

type Config struct {
	ReactAppUrl string
	DbHost      string
	DbName      string
	DbPort      string
	DbUser      string
	DbPassword  string
}

func Load() *Config {
	return &Config{
		ReactAppUrl: os.Getenv("REACT_APP_URL"),
		DbHost:      os.Getenv("DB_HOST"),
		DbName:      os.Getenv("PG_DATABASE"),
		DbPort:      os.Getenv("PG_PORT"),
		DbUser:      os.Getenv("PG_USER"),
		DbPassword:  os.Getenv("PG_PASSWORD"),
	}
}
