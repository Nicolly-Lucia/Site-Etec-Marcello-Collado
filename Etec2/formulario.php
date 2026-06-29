<?php
// Página que processa o formulário e mostra a mensagem
$mensagem = "";
$tipo = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefone = trim($_POST['telefone'] ?? '');
    $msg = trim($_POST['mensagem'] ?? '');
    
    // Validação dos campos
    if (empty($nome)) {
        $mensagem = "Por favor, informe seu nome.";
        $tipo = "erro";
    } 
    elseif (empty($email)) {
        $mensagem = "Por favor, informe seu e-mail.";
        $tipo = "erro";
    } 
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mensagem = "Por favor, informe um e-mail válido (exemplo@email.com).";
        $tipo = "erro";
    } 
    elseif (empty($msg)) {
        $mensagem = "Por favor, escreva sua mensagem.";
        $tipo = "erro";
    } 
    elseif (strlen($msg) > 500) {  // <-- NOVA VALIDAÇÃO
        $mensagem = "A mensagem não pode ter mais de 500 caracteres. Você usou " . strlen($msg) . " caracteres.";
        $tipo = "erro";
    } 
    else {
        $mensagem = "Mensagem enviada com sucesso! Entraremos em contato em breve.";
        $tipo = "sucesso";
        
        // Aqui você pode enviar e-mail ou salvar no banco depois
        // Exemplo de envio de e-mail (descomente quando tiver um servidor de email configurado):
        /*
        $para = "contato@etec.sp.gov.br";
        $assunto = "Nova mensagem de contato - Etec";
        $corpo = "Nome: $nome\nE-mail: $email\nTelefone: $telefone\nMensagem: $msg";
        $headers = "From: $email";
        mail($para, $assunto, $corpo, $headers);
        */
    }
} 
else {
    // se acessar diretamente sem passar pelo formulário
    header("Location: contato.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Etec - Resultado do Contato</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .box {
            max-width: 500px;
            width: 100%;
            margin: 20px;
            padding: 50px 40px;
            background: white;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .box i {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .box h2 {
            margin-bottom: 15px;
            font-size: 1.8rem;
        }
        
        .box p {
            color: #555;
            margin-bottom: 30px;
            line-height: 1.6;
            font-size: 1rem;
        }
        
        .btn {
            display: inline-block;
            background: #cc0000;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 4px;
        }
        
        .btn:hover {
            background: #8b0000;
            transform: translateY(-2px);
        }
        
        .sucesso i { color: #28a745; }
        .erro i { color: #dc3545; }
        .sucesso h2 { color: #28a745; }
        .erro h2 { color: #dc3545; }
        
        @media (max-width: 480px) {
            .box {
                padding: 30px 20px;
            }
            
            .box h2 {
                font-size: 1.4rem;
            }
        }
    </style>
</head>
<body>
    <div class="box <?php echo $tipo; ?>">
        <?php if ($tipo == "sucesso"): ?>
            <i class="fas fa-check-circle"></i>
            <h2>Mensagem Enviada com sucesso!</h2>
            <p><?php echo $mensagem; ?></p>
            <a href="contato.html" class="btn">Voltar para o Contato</a>
            
        <?php else: ?>
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Algo deu errado!</h2>
            <p><?php echo $mensagem; ?></p>
            <a href="contato.html" class="btn">Voltar e corrigir</a>
        <?php endif; ?>
    </div>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</body>
</html>