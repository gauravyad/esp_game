<?php
include('connect.php');
if(isset($_POST['action']))
{          
    if($_POST['action']=="login")
    {   $con = mysqli_connect("localhost","root","root","esp") or die(mysqli_error($con));
        $email = mysqli_real_escape_string($con,$_POST['email']);
        $password = mysqli_real_escape_string($con,$_POST['password']);
        $strSQL = mysqli_query($con,"select name from users where email='".$email."' and password='".md5($password)."'");
        $Results = mysqli_fetch_array($strSQL);
        if( count_chars($Results))
        {
            $message = "<script type='text/javascript'>alert(' Login Sucessfully!!')</script>";
            session_start();
            $_SESSION['login_user']= $email;
            header("Location:home.php");
        }
        else
        {
            $message = "<script type='text/javascript'>alert('Invalid email or password!!')</script>";
        }   
        echo $message;     
    }
    elseif($_POST['action']=="signup")
    {    $con = mysqli_connect("localhost","root","root","esp") or die(mysqli_error($con));
        $name       = mysqli_real_escape_string($connection,$_POST['name']);
        $email      = mysqli_real_escape_string($connection,$_POST['email']);
        $password   = mysqli_real_escape_string($connection,$_POST['password']);
        $answer='';
        $query = "SELECT email FROM users where email='".$email."'";
        //$result = mysqli_query($connection,$query);
        //$numResults = mysqli_num_rows($result);
        $numResults=0;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) // Validate email address
        {
            $message =  "Invalid email address please type a valid email!!";
        }
        elseif($numResults>=1)
        {
            $message = $email." Email already exist!!";
        }
        else
        {
            $sql="insert into users(username,email,password,answers) values('".$name."','".$email."','".md5($password)."','".$answer."')";
            mysqli_query($con,$sql) or die("Error in Insertion: ".mysqli_error($con));
    echo "Successfully Inserted";
            
        }
    }
}
  
?>
<!DOCTYPE html>
<html lang="en">
  <head>
   <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">

    <title>ESP</title>

    <!-- Bootstrap core CSS -->
    <<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="index.css" type="text/css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </script>
    
  </head>
  <body>
       <form action="" method="post">
            <div class="modal-dialog" style="position: absolute;left: 50%;margin-left: -312px;height: 500px;top: 50%;margin-top: -250px;">
                <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Log-in</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                        <label for="exampleInputName1">Name</label>
                        <input class="form-control" id="name" name="name" placeholder="Name" type="name">
                        </div>
                        <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input class="form-control" id="email" name="email" placeholder="Enter email" type="email">
                        </div>
                        <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input class="form-control" id="password" name="password" placeholder="Password" type="password">
                        </div>
                
                    </div>
                    <div class="modal-footer">
                        <a href="#" data-dismiss="modal" class="btn">Close</a>
                        <input name="action" type="hidden" value="signup" />
                        <input type="submit" value="signup"  class="btn btn-primary"></a>
                    </div>
                </div>
            </div>
        </form>
  </body>