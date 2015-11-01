package de.nordakademie.issuetracker.server;

import static spark.Spark.*;

import java.io.InputStream;
import java.util.Scanner;

import org.eclipse.jetty.util.MultiMap;
import org.eclipse.jetty.util.UrlEncoded;

public class MyDslServer {
	public static void main(String[] args) {
		
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
			+	"},"
			+	"{"
			+	"\"typename\":\"task\""			
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
