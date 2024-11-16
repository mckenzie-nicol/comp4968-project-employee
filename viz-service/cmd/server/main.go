package main

import (
	"log"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	_ "github.com/lib/pq"

	"viz-service/config"
	"viz-service/internal/api"
	"viz-service/internal/database"
)

var muxLambda *gorillamux.GorillaMuxAdapter

func init() {
	cfg := config.Load()

	db, err := database.NewDB(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	handler := api.NewHandler(db)
	router := api.SetupRoutes(handler)

	muxLambda = gorillamux.New(router)
}

func main() {
	lambda.Start(muxLambda.ProxyWithContext)
}
