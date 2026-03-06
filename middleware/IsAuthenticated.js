import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {

    let token ;
    const authHeaders = req.headers.authorization;

    if(authHeaders && authHeaders.startsWith("Bearer ")){
        token = authHeaders.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message : "No token! Authorization denied"
            })
        }

        try {
            const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decodedUser;
            console.log("Decoded user is :", req.user);  
            next();  
        } 
        catch (error) {
            return res.status(400).json({
                message : "Token invalid"
            })
        }
    }else{
        return res.status(401).json({ message : "No token! Authorization denied"});
    }
}

export default verifyToken;