package com.Server.AzuremGuideServer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.logging.LoggingInitializationContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.print.DocFlavor;
import javax.xml.crypto.Data;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;

@SpringBootApplication
@RestController
public class AzuremGuideServerApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(AzuremGuideServerApplication.class);
	//Com o intuito de facilitar no processamento de dados, nomeadamente no desenho dos graficos, foi incluido um servidor no Projeto.
 	//O servidor utiliza o framework Spring complementado com o Springboot de modo a criar um servidor capaz de responder a pedidos HTTP que provém da aplicação através de uma REST Api que corre no mesmo.
	//O objetivo é dar a possibilidade de os utilizadores guardarem os ficheiros csv numa base de dados fora do telemóvel de modo a poupar espaço
	//2 objetivos adicionais para o servidor é a implementação do processamento e formulação de uma rota e envio para o utilizador e armazenamento da mesma na máquina que corre o servidor quando o utilizador fizesse um pedido para obter as rotas que uma sala possui.
	//Outro objetivo adicional é o envio desta rota sob a imagem de gráfico para o utilizaodor quando este aceda às rotas , mas inicialmente vai ser enviada sob a forma de caractéres alfa-numéricos por questões de facilidade
	//Contudo por falta de tempo e competência a nível do processamento gráfico em Java, apenas o armazenamento das rotas na máquina em que corre o servidor e o envio de todas as Salas com rotas para o utilizador foi possível.

	public static void main(String[] args) {
		SpringApplication.run(AzuremGuideServerApplication.class, args);
	}
	//Métodos e Funções ligadas ao server
	@PostMapping("/trajectoriestoSQLUpload")
	public void uploadData(
			               @RequestParam(value = "positionsx", required = true) String positionsX,
						   @RequestParam(value = "positionsy", required = true) String positionsY,
						   @RequestParam(value = "timeUnix", required = true) Integer timeUnix,
						   @RequestParam(value = "salaorigem", required = true) String salaorigem,
						   @RequestParam(value = "salachegada", required = true) String salachegada,
						   HttpServletResponse response){
		
		Gson gson = new Gson();

		response.setStatus(HttpServletResponse.SC_CREATED);
		LOGGER.info(positionsX);
		System.out.println(positionsY);
		updatesql(positionsX,positionsY,timeUnix,salaorigem,salachegada);
		try {
			response.getWriter().write(gson.toJson("Sucess"));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	@GetMapping("/TEST")
	public void Test(
			HttpServletResponse response
	){
		Gson gson = new Gson();
		String temp = gson.toJson("TESTE");
		try {
			response.getWriter().write(temp);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/getknownRooms")
	public void getknownRooms(
			HttpServletResponse response
	){
		Gson gson = new Gson();
		String temp = GetRooms_withRoutes();
		System.out.println(temp);
		try {
			response.getWriter().write(gson.toJson(temp));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}



	//Métodos e Funções ligadas à DB
	private String GetRooms_withRoutes(){
		String temp ="";
		String url = "jdbc:mysql://localhost:3306/AzuremGuideDB";
		String user = "root";
		String password = "tagala@123";
		String columnLabel = "SalaOrigem";
		try (Connection conn = DriverManager.getConnection(url, user, password)) {
			String query = "SELECT *" + " FROM " + "DadosAzurem";
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(query);

			while (rs.next()) {
				temp = temp.concat(rs.getString(5)+',');
				System.out.println(temp);
			}
			System.out.println("Routes inside the DB:" + temp);
			return temp;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "";
	}

	private String GetRoutes_for_Room(String Room){
		String temp ="";
		String url = "jdbc:mysql://localhost:3306/AzuremGuideDB";
		String user = "root";
		String password = "tagala@123";
		String columnLabel = "SalaOrigem";
		try (Connection conn = DriverManager.getConnection(url, user, password)) {
			String query = "SELECT " + columnLabel + " FROM " + "DadosAzurem";
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				temp.concat(rs.getString(columnLabel));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return temp;
	}


	private void updatesql(String PX , String PY, int TempoU, String SalaOriginal, String SalaChegou){
		String url = "jdbc:mysql://localhost:3306/AzuremGuideDB";
		String user = "root";
		String password = "tagala@123";
		String sql = "select * from ";
		String columnLabel = "";
		String putQuery = "INSERT INTO DadosAzurem(PositionX,PositionY,UnixTime,SalaOrigem,SalaChegada)VALUES(?, ?, ?, ?, ?)";
		String selectQuery = "SELECT * FROM DadosAzurem WHERE UnixTime = ? AND SalaOrigem = ? AND SalaChegada = ?";

		Gson gson = new Gson();
		String LIST_X = gson.toJson(PX);
		String LIST_Y = gson.toJson(PY);

		try{
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		}

		try {

			try(Connection con = DriverManager.getConnection(url, user, password);
				Statement statement = con.createStatement();
			){
				PreparedStatement selectStmt = con.prepareStatement(selectQuery);
				selectStmt.setInt(1, TempoU);
				selectStmt.setString(2,SalaOriginal);
				selectStmt.setString(3, SalaChegou);
				PreparedStatement pstmt = con.prepareStatement(putQuery);
				try (ResultSet resultSet = selectStmt.executeQuery()) {
					if (!resultSet.next()) {
						pstmt.setObject(1, PX);
						pstmt.setObject(2, PY);
						pstmt.setInt(3, TempoU);
						pstmt.setString(4,SalaOriginal);
						pstmt.setString(5, SalaChegou);
						pstmt.execute();
						System.out.println("Inserted successfully");
						System.out.println("Inserted records into the table...");
					} else {
						System.out.println("Row already exists in the table, not inserting");
					}
				}

			}

		} catch (Exception e){
			e.printStackTrace();
		}
	}

}
class PositionsX {
	public ArrayList<Float> positionsX;

	public ArrayList<Float> getPositionsX() {
		return positionsX;
	}

	public void setPositionsX(ArrayList<Float> positionsX) {
		this.positionsX = positionsX;
	}
}
class PositionsY {
	public ArrayList<Float> positionsY;

	public ArrayList<Float> getPositionsY() {
		return positionsY;
	}

	public void setPositionsY(ArrayList<Float> positionsY) {
		this.positionsY = positionsY;
	}
}
