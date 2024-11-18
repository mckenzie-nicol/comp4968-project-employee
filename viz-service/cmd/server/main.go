package main

import (
	"log"

	"database/sql"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	_ "github.com/lib/pq"

	"viz-service/config"
	"viz-service/internal/api"
	"viz-service/internal/database"
)

var (
	muxLambda *gorillamux.GorillaMuxAdapter
	db        *sql.DB
	initErr   error
)

func init() {
	cfg := config.Load()

	db, initErr = database.NewDB(cfg)
	if initErr != nil {
		log.Printf("Failed to initialize database: %v", initErr)
	} else {
		log.Println("Database initialized successfully.")
	}

	handler := api.NewHandler(db)
	router := api.SetupRoutes(handler)
	router.Use(api.CORSMiddleware)

	muxLambda = gorillamux.New(router)
}

func main() {
	lambda.Start(muxLambda.ProxyWithContext)
}
