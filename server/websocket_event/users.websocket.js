const   Users = require("../api/Users.api"),
    authenticator = require("../OAuth2_authenticator"),
    logger = require("../logger");

const usersSocket = (socket, globalStorage) => {
    const auth = new authenticator(globalStorage);
    const i_users_api = new Users(globalStorage, auth);
    socket.on("users.get.all", () => {
        if (!globalStorage.connected_users_array) {
            i_users_api.getConnectedUsers(9, (result) => {
                if (result.success){
                    socket.emit("connectedUsers", JSON.stringify(result.content));
                    logger.add_log({
                        type:"General", 
                        description:"Emit connectedUsers from Request"
                    });
                }
                else
                {
                    socket.emit("connectedUsers", JSON.stringify({"error": true, "message": result.message}));
                    logger.add_log({
                        type:"Error", 
                        description:"couldn't Retrieve connectedUsers from Request"
                    });					
                }	
            });
        } else {
            logger.add_log({
                type:"General", 
                description:"Emit connectedUsers from Cache"
            });
            socket.emit("connectedUsers", JSON.stringify({
                last_request: globalStorage.connected_users_last_request, 
                array: globalStorage.connected_users_array
            }));
        }
    });
    socket.on("user.get.infos", ({userId, userToken}) => {
        if (!userToken ||userToken === undefined) {
            logger.add_log({
                type:"Error", 
                description:"Request UserInfos Failed", 
                additionnal_infos: {
                    Error: "No token provided by the client"
                }
            });                
            socket.emit("error.fetch", "No token provided");
        } else {
            i_users_api.getUserInfos(userId, userToken)
                .then(response => {
                    if (response.error ) {
                        logger.add_log({
                            type:"Error", 
                            description:"Request UserInfos Failed", 
                            additionnal_infos: {
                                Error: response.error
                            }
                        });               
                        socket.emit("error.fetch", response.error);
                    }          
                    else {
                        logger.add_log({
                            type:"General", 
                            description:"Request UserInfos Succeeded"
                        });
                        socket.emit("user.getted.infos", response);
                    }
                })
                .catch(error => {
                    logger.add_log({
                        type:"General", 
                        description:"Request UserInfos Failed", 
                        additionnal_infos: {
                            Error: error
                        }
                    });          
                    socket.emit("error.fetch", error);
                });
        }
    });
};

module.exports = usersSocket;