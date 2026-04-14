import React, {useState} from "react";
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MuiAlert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { PostWithAuth } from "../../services/HttpService";
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: 800,
      textAlign : "left",
      margin : 20
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    avatar: {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
    link: {
        textDecoration : "none",
        boxShadow : "none",
        color : "white"
    }
  }));

function PostForm(props) {
   const {userId, userName, refreshPosts} = props;
   const classes = useStyles();
   const [text, setText] = useState("");
   const [title, setTitle] = useState("");
   const [isSent, setIsSent] = useState(false);

   const savePost = () => {
    PostWithAuth("/posts", {
      title: title, 
      userId : userId, /* önceden userId propslardan geliyordu artık current user'dan gelecek!!!!!! */
      text : text,
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
    }
/* Öncelikle dersler için çok teşekkür ederim, çok yardımcı oldunuz :)  
Bir hata aldım ve sonra onu çözdüm. 
Buraya da yazmak istedim. 
refreshPosts metodunu use Effect icinde çağırdıktan sonra array içine postList koyarak postList güncellendikçe çalışmasını istedik. 
Fakat postList'i zaten refreshPosts içinde set ettiğimiz için loop'a giriyor ve (spring boot'a bakarsanız) sürekli get request atıyor. 
Aynı durum refreshComments metodu icin de gecerli. 
Bu nedenle use effect sadece sayfa ilk defa render olduğuda çalışsın diye array'i boş bırakmak 
ve refreshPosts'u props'tan aktarıp PostForm komponentindeki handleSubmit'ten çağırmak yeterli. 
Böylece submit oldukça get request yapılacak. 
Aynı durum refreshComments metodu icin de gecerli. */
   const handleSubmit = () => {
        savePost();
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPosts();
        /* savePost().then(() => {
        setIsSent(true);
        setTitle("");
        setText("");
        refreshPosts();
    });  Kod genel olarak temiz yazılmış. Ancak dikkatimi çeken bir nokta;
    savePost fonksiyonu bir Promise döndürüyor. 
    handleSubmit içinde refreshPosts() fonksiyonu savePost'un bitmesini beklemeden (asenkron olarak) çalışıyor.

Eğer internet yavaşsa, 
backend henüz kaydı tamamlamadan liste güncellenmeye çalışılabilir ve yeni post listede hemen görünmeyebilir. */
   }

   const handleTitle = (value) => {
       setTitle(value);
       setIsSent(false);
   }
   
   const handleText = (value) => {
       setText(value);
       setIsSent(false);
   }
/* !!!  Neden setIsSent(false)?

👉 Yeni yazı yazınca “post gönderildi” mesajı kaybolsun diye */
   const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }/* 👉 Eğer kullanıcı bildirimin dışına tıklarsa KAPATMA

Yani:

yanlışlıkla kapanmasın
kullanıcı mesajı görsün */

    setIsSent(false);
  };

   return(
       <div>
       <Snackbar open={isSent} autoHideDuration={1200} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Your post is sent!
        </Alert>
      </Snackbar>
      <Card className={classes.root}>
                <CardHeader
                    avatar={
                    <Link  className={classes.link} to={{pathname : '/users/' + userId}}>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    </Link>
                    }
                    title= {<OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    placeholder = "Title"
                    inputProps = {{maxLength : 25}}
                    fullWidth
                    value = {title}  /* TITLE Prop dan gelmeyecek elle doldurulacak */
                    onChange = { (i) => handleTitle(i.target.value)}
                    /* içerisine input alacak ve o input´u (i) yani i.target.value ´sunu o  fonksiyona gönderecek */
                    /* state update oluyor
UI yeniden render oluyor 

👉 buna controlled component denir */
                    >    
                    </OutlinedInput>}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    <OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    placeholder = "Text"
                    inputProps = {{maxLength : 250}}
                    fullWidth
                    value = {text}
                    onChange = { (i) => handleText(i.target.value)}
                    endAdornment = {
                        <InputAdornment position = "end">
                        <Button
                        variant = "contained"
                        style = {{background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'}}
                        onClick = {handleSubmit}
                        >Post</Button>
                        </InputAdornment>
                    }
                    >    
                    </OutlinedInput>
                    </Typography>
                </CardContent>
                </Card>
       </div>
   )
}

export default PostForm;