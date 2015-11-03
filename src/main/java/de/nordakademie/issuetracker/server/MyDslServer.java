package de.nordakademie.issuetracker.server;

import static spark.Spark.*;

import java.io.InputStream;
import java.util.Scanner;

import org.eclipse.jetty.util.MultiMap;
import org.eclipse.jetty.util.UrlEncoded;

import com.mongodb.MongoClient;

public class MyDslServer {
	public static void main(String[] args) {
		
		final String DATABASE_NAME = "mydslIssueTracker";
		
		MongoInitializer mi = new MongoInitializer();
		MongoClient mongoClient = mi.client();
		
		MongoWrapper mongoWrapper = new MongoWrapper(mongoClient,DATABASE_NAME);
		
		//Mongo initialisieren
		boolean deleteDataBeforeStart = true;
		mi.initialize(deleteDataBeforeStart);
		
		
		
		staticFileLocation("/html");
		
		get("/", (req, res) -> {
			return loadFile("/html/issuetracker.html");
		});
		
		get("/getIssuetypes", (req, res) -> {
			res.type("application/json");
			return "{\"issueTypes\":[{"
			+	"\"typename\":\"bug\""			
			+	"},"
			+	"{"
			+	"\"typename\":\"issue\""
			+	"}]"
			+"}";});		
		
		get("/getPersons", (req, res) -> {
			res.type("application/json");
			return "{\"persons\":[{"
					+	"\"id\":\"P009876\","
					+	" \"surname\":\"Maiser\","
					+	" \"role\":\"admin\""
					+	"},"
					+	"{"
					+	"\"id\":\"P994466\","
					+	"\"surname\":\"Muster\","
					+ 	"\"role\":\"developer\""
					+	"}]"
					+"}";});
		
		get("/getPersonsFromDb", (req, res) -> {
			res.type("application/json");
			return mongoWrapper.getFullCollectionAsJson("persons");
		});
		
		post("/issues", (req, res) -> {
			MultiMap<String> formData = new MultiMap<String>();
			UrlEncoded.decodeTo(req.body(), formData, "UTF-8");
			
			return "";
		});
	}
	
	public static String loadFile(String path){
		return getString(MyDslServer.class.getResourceAsStream(path));
	}

	private static String getString(InputStream is) {
		try(java.util.Scanner s = new Scanner(is).useDelimiter("\\A")){			
			return s.hasNext() ? s.next() : "";
		}
	}
}
