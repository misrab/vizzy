package main 


import (
	"log"

	"net/http"

	"github.com/gorilla/mux"
)


func main() {
	router := mux.NewRouter()

	// static
    router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))
    // register routes
    http.Handle("/", router)

    log.Println("Listening...")
    http.ListenAndServe(":4000", nil)
}