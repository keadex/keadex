/**
Generates a demo of a diagram's PlantUML file.
*/
pub fn generate_demo_diagram_puml() -> String {
  String::from("@startuml

Person(customer, \"Personal Banking Customer\", \"A customer of the bank.\")
  
System(internetBanking, \"Internet Banking System\", \"Allows customers to view information about their bank accounts, and make payments.\")
  
System_Ext(mainframeBanking, \"Mainframe Banking System\", \"Stores all of the core banking information about customers, accountsm transactions, etc.\")
  
System_Ext(emailSystem, \"Email System\", \"The internal mail system.\")
  
Rel(customer, internetBanking, \"Views account, balances, and makes payments using\", \"HTTPS\")
  
Rel(internetBanking, mainframeBanking, \"Gets account information from, and makes payments using\", \"HTTPS\")
  
Rel(internetBanking, emailSystem, \"Sends email using\", \"HTTPS\")
  
@enduml")
}
