package config

import "os"

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type Config struct {
	ReactAppUrl string
	DB          DBConfig
}

func Load() *Config {
	return &Config{
		ReactAppUrl: os.Getenv("REACT_APP_URL"),
		DB: DBConfig{
			Host:     os.Getenv("PG_HOST"),
			Port:     os.Getenv("PG_PORT"),
			User:     os.Getenv("PG_USER"),
			Password: os.Getenv("PG_PASSWORD"),
			Name:     os.Getenv("PG_DATABASE"),
		},
	}
}
