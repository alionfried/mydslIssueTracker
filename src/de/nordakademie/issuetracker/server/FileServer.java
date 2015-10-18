package de.nordakademie.issuetracker.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class FileServer {
	public static void main(String[] args) throws Exception {
		Server server = new Server(8080);

		ResourceHandler resource_handler = new ResourceHandler();

		resource_handler.setDirectoriesListed(true);
		resource_handler.setWelcomeFiles(new String[] { "issuetracker.html" });
		resource_handler.setResourceBase("src/de/nordakademie/issuetracker/html");

		server.setHandler(resource_handler);
		server.start();
		server.join();

	}
}
