// All varibales are present in MainCanvasHandler.js file


var s2_PhrasesTexture=[];
var s2_Phrases = ["Overconfidence", "Midlife Crisis", "Laziness", "Cheap Talks", "Negligence","Inconsistent"];

var s2_LACourseTexture=[];
var s2_LACourses =["Fundamentals","Win32","COM","WinRT","RTR","UNIX"];

var s2_LARootsText = ["LIFE"];
var s2_LARootsTextTexture=[];

// helical lookat flag
bHelicalLookAt = false;

//sc2_LA_Sphere_Ypos
var showCourceFont = false;//s2_lookatflag
var s2_BlackOutFlag = false;
var s2_BlackOutVariable = 1.0;

var s2_Phrase_Flag1 = false;
var s2_Phrase_Flag2 =false;
var s2_Phrase_Flag3 =false;

var s2_Phrase_value1 = 1.0;
var s2_Phrase_value2 = 1.0;
var s2_Phrase_value3 = 1.0;

//1 ==>  Overconfidence
var showsphere1_flag=true;
var sphere1_transflag = false;
var sphere1_xpos = 5.0;
var sphere1_ypos = 18.0;
var sphere1_blendFlag = false;
var sphere1_blendValue = 1.0;

//2 => Inconsistent
var showsphere2_flag = true;
var sphere2_transflag = false;
var sphere2_xpos = -5.0;
var sphere2_ypos = 18.0;
var sphere2_blendFlag = false;
var sphere2_blendValue = 1.0;

//3 => "Cheap Talks"
var showsphere3_flag = true;
var sphere3_transflag = false;
var sphere3_xpos = -10.0;
var sphere3_ypos = 18.0;
var sphere3_blendFlag = false;
var sphere3_blendValue = 1.0;

//4 => "Midlife Crisis"
var showsphere4_flag = true;
var sphere4_transflag = false;
var sphere4_xpos = 10.0;
var sphere4_ypos = 18.0;
var sphere4_blendFlag = false;
var sphere4_blendValue = 1.0;

//5 => "Negligence"
var showsphere5_flag = true;
var sphere5_transflag = false;
var sphere5_xpos = -15.0;
var sphere5_ypos = 18.0;
var sphere5_blendFlag = false;
var sphere5_blendValue = 1.0;

//6 => "Laziness"
var showsphere6_flag = true;
var sphere6_transflag = false;
var sphere6_xpos = 15.0;
var sphere6_ypos = 18.0;
var sphere6_blendFlag = false;
var sphere6_blendValue = 1.0;

var helicalTree_alphaValue = 1.0;



function treeInit()
{
    /* Tree Setup Start */
    var vertexShaderSourceCode_tree =
        "#version 300 es" +
        "\n" +
        "in vec3 vPosition;" +
        "in vec3 vColor;" +
        "in vec2 vTexture0_Coord;" +
        "out vec2 out_texture0_coord;" +
        "out vec3 outColor;" +
        "uniform mat4 u_m_matrix;" +
        "uniform mat4 u_v_matrix;" +
        "uniform mat4 u_p_matrix;" +
        "void main (void)" +
        "{" +
        "gl_Position = (u_p_matrix * u_v_matrix * u_m_matrix) * vec4(vPosition.x,vPosition.y,vPosition.z,1.0);" +
        "out_texture0_coord = vTexture0_Coord;" +
        "outColor = vColor;" +
        "}";
    vertexShaderObject_tree = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject_tree, vertexShaderSourceCode_tree);
    gl.compileShader(vertexShaderObject_tree);
    if (gl.getShaderParameter(vertexShaderObject_tree, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(vertexShaderObject_tree);
        if (error.length > 0) {
            alert(error);
            samUninitialize();
        }
    }

    // fragment shader
    var fragmentShaderSourceCode_tree =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "in vec2 out_texture0_coord;" +
        "in vec3 outColor;" +
        "out vec4 FragColor;" +
        "uniform highp sampler2D u_texture0_sampler;" +
        "uniform float u_alphaValue;" +
        "void main (void)" +
        "{" +
        "float c = texture(u_texture0_sampler,out_texture0_coord).r + 0.1;" +
        "FragColor = vec4(c*outColor,u_alphaValue);" +
        "}";

    fragmentShaderObject_tree = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject_tree, fragmentShaderSourceCode_tree);
    gl.compileShader(fragmentShaderObject_tree);

    if (!gl.getShaderParameter(fragmentShaderObject_tree, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(fragmentShaderObject_tree);
        if (error.length > 0) {
            alert(error);
            samUninitialize();
        }
    }

    // shader program
    shaderProgramObject_tree = gl.createProgram();
    gl.attachShader(shaderProgramObject_tree, vertexShaderObject_tree);
    gl.attachShader(shaderProgramObject_tree, fragmentShaderObject_tree);

    // pre-link building of shader
    gl.bindAttribLocation(shaderProgramObject_tree, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
    gl.bindAttribLocation(shaderProgramObject_tree, WebGLMacros.AMC_ATTRIBUTE_COLOR, "vColor");
    gl.bindAttribLocation(shaderProgramObject_tree, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, "vTexture0_Coord");

    //link
    gl.linkProgram(shaderProgramObject_tree);
    if (!gl.getProgramParameter(shaderProgramObject_tree, gl.LINK_STATUS)) {
        var error = gl.getProgramParameter(shaderProgramObject_tree, gl.LINK_STATUS);
        if (error.length > 0) {
            alert(error);
            samUninitialize();
        }
    }

    uniform_texSampler_tree = gl.getUniformLocation(shaderProgramObject_tree, "u_texture0_sampler");
    uniform_ModelMat_tree = gl.getUniformLocation(shaderProgramObject_tree, "u_m_matrix");
    uniform_ViewMat_tree = gl.getUniformLocation(shaderProgramObject_tree, "u_v_matrix");
    uniform_ProjectionMat_tree = gl.getUniformLocation(shaderProgramObject_tree, "u_p_matrix");
    uniform_AlphaValue_tree = gl.getUniformLocation(shaderProgramObject_tree, "u_alphaValue");

    rnd = new Float32Array(5 * 3000);
    for (var i = 0; i < 5 * 3000; i++) {
        rnd[i] = Math.random();
    }
    //rand();
    pt = new Float32Array(6600000);
    ind = new Uint32Array(3500000);
    sin = new Float32Array(2 * su - 1);
    cos = new Float32Array(2 * su - 1);
    for (var i = 0; i < 2 * su - 1; i++) {
        var fi = Math.PI * i / (su - 1);
        sin[i] = Math.sin(fi);
        cos[i] = Math.cos(fi);
    }
    tree();

    // Fill  data in GPU
    vertexArrayObject_tree = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayObject_tree);
    vertexBufferObject_tree = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject_tree);
    gl.bufferData(gl.ARRAY_BUFFER, pt, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);

    gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);

    gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 32, 24);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    vertexBufferObject_Elements_tree = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_tree);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ind, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    /* Tree Setup Stop */
    /*	Fill Roots Data  Start*/

    var vertexShaderSourceCode_root =
        "#version 300 es" +
        "\n" +
        "in vec3 vPosition;" +
        "in vec3 vColor;" +
        "in vec2 vTexture0_Coord;" +
        "out vec2 out_texture0_coord;" +
        "out vec3 outColor;" +
        "uniform mat4 u_m_matrix;" +
        "uniform mat4 u_v_matrix;" +
        "uniform mat4 u_p_matrix;" +
        "void main (void)" +
        "{" +
        "gl_Position = (u_p_matrix * u_v_matrix * u_m_matrix) * vec4(vPosition.x,vPosition.y,vPosition.z,1.0);" +
        "out_texture0_coord = vTexture0_Coord;" +
        "outColor = vColor;" +
        "}";
    vertexShaderObject_root = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject_root, vertexShaderSourceCode_root);
    gl.compileShader(vertexShaderObject_root);
    if (gl.getShaderParameter(vertexShaderObject_root, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(vertexShaderObject_root);
        if (error.length > 0) {
            alert(error);
            samUninitialize();
        }
    }

    // fragment shader
    var fragmentShaderSourceCode_root =
        "#version 300 es" +
        "\n" +
        "precision highp float;" +
        "in vec2 out_texture0_coord;" +
        "in vec3 outColor;" +
        "out vec4 FragColor;" +
        "uniform highp sampler2D u_texture0_sampler;" +
        "uniform float u_alphaValue;" +
        "void main (void)" +
        "{" +
        "	vec2 tempTexCoord = vec2(out_texture0_coord.y,out_texture0_coord.x);" +
        "	float c = texture(u_texture0_sampler,out_texture0_coord).r + 0.1;" +
        "	FragColor = vec4(c*outColor,u_alphaValue);" +
        "}";

    fragmentShaderObject_root = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject_root, fragmentShaderSourceCode_root);
    gl.compileShader(fragmentShaderObject_root);

    if (!gl.getShaderParameter(fragmentShaderObject_root, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(fragmentShaderObject_root);
        if (error.length > 0) {
            alert(error);
            samUninitialize();
        }
    }

    // shader program
    shaderProgramObject_root = gl.createProgram();
    gl.attachShader(shaderProgramObject_root, vertexShaderObject_root);
    gl.attachShader(shaderProgramObject_root, fragmentShaderObject_root);

    // pre-link building of shader
    gl.bindAttribLocation(shaderProgramObject_root, WebGLMacros.AMC_ATTRIBUTE_VERTEX, "vPosition");
    gl.bindAttribLocation(shaderProgramObject_root, WebGLMacros.AMC_ATTRIBUTE_COLOR, "vColor");
    gl.bindAttribLocation(shaderProgramObject_root, WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, "vTexture0_Coord");

    //link
    gl.linkProgram(shaderProgramObject_root);
    if (!gl.getProgramParameter(shaderProgramObject_root, gl.LINK_STATUS)) {
        var error = gl.getProgramParameter(shaderProgramObject_root, gl.LINK_STATUS);
        if (error.length > 0) {
            alert(error);
            samUninitialize();
        }
    }

    uniform_texSampler_root = gl.getUniformLocation(shaderProgramObject_root, "u_texture0_sampler");
    uniform_ModelMat_root = gl.getUniformLocation(shaderProgramObject_root, "u_m_matrix");
    uniform_ViewMat_root = gl.getUniformLocation(shaderProgramObject_root, "u_v_matrix"); 
    uniform_ProjectionMat_root = gl.getUniformLocation(shaderProgramObject_root, "u_p_matrix");
    uniform_alphaValue_root = gl.getUniformLocation(shaderProgramObject_root, "u_alphaValue");

    rnd = new Float32Array(5 * 3000);
    for (var i = 0; i < 5 * 3000; i++) {
        rnd[i] = Math.random();
    }

    pt_root = new Float32Array(6600000);
    ind_root = new Uint32Array(3500000);
    sin = new Float32Array(2 * su_root - 1);
    cos = new Float32Array(2 * su_root - 1);
    for (var i = 0; i < 2 * su_root - 1; i++) {
        var fi = Math.PI * i / (su_root - 1);
        sin[i] = Math.sin(fi);
        cos[i] = Math.cos(fi);
    }
    roots();

    vertexArrayObject_root = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayObject_root);
    vertexBufferObject_root = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject_root);
    gl.bufferData(gl.ARRAY_BUFFER, pt_root, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_VERTEX, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_VERTEX);

    gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);

    gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0, 2, gl.FLOAT, false, 32, 24);
    gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    vertexBufferObject_Elements_root = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_root);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ind_root, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
    /*	Fill Roots Data  Stop */

    var k = 512, img = new Uint8Array(4 * k * k);
    bark_tex(k, img)
    texture_bark = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture_bark);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, k, k, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    //gl.bindTexture(gl.TEXTURE_2D,null); 

    var k = 2 * 64, img = new Uint8Array(4 * k * k);
    leaf_tex3(k, img)

    texture_leaf = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture_leaf);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, k, k, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
	//gl.bindTexture(gl.TEXTURE_2D,null);
    
    // make texture for phrases
    s2_PhrasesTexture = createTextTexture(s2_Phrases,2350,300,"red");

    s2_LACourseTexture = createTextTexture(s2_LACourses, 10000, 660,"green");

    s2_LARootsText = createTextTexture(s2_Phrases, 2350, 300, "red");

    // Filling Array with conical helix coordinate for lookat
    for(var i = 0; i < num_points; i = i+3)
    {
        var angle = 6 * Math.PI * i/ num_points;

        // conical helix
        helixVertices[i]    = 0.1 * angle * Math.cos(angle);
        helixVertices[i+2]  = 0.1 * angle * Math.sin(angle);
        helixVertices[i+1]  = -0.1 * angle;
    }
}

function scene2DisplayText()
{
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotationMatrix = mat4.create();

    //0 : Overconfidence
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [19.0, 12.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, s2_PhrasesTexture[0]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, s2_Phrase_value1);//s2_Phrase_Flag1
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);


    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    //1 : Midlife Crisis
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [25.0, 2.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, s2_PhrasesTexture[1]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, s2_Phrase_value2);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    //2 : Laziness
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [27.0, -10.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, s2_PhrasesTexture[2]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, s2_Phrase_value3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);


    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    //3: Cheap Talks
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-27.0, 2.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, s2_PhrasesTexture[3]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, s2_Phrase_value2);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    //4 : Negligence
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-28.5, -10.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, s2_PhrasesTexture[4]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, s2_Phrase_value3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    //5 : Inconsistent
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-19.0, 12.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, s2_PhrasesTexture[5]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, s2_Phrase_value1);//s2_Phrase_Flag1
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    

}

function sphereDsiplay()
{
    //sphereMesh
    var translateMatrix = mat4.create();
    var scaleMatrix = mat4.create();
    var rotationMatrix = mat4.create();
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();

    // Winner Sphere
    gl.useProgram(s1_ShaderProgramObject);
    
    mat4.translate(translateMatrix, translateMatrix, [0.0, winner_sphere_Ypos, -33.0]);
    mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
    mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.5, 0.5, 0.5));

    mat4.multiply(modelMatrix, modelMatrix,translateMatrix );
    mat4.multiply(modelMatrix, modelMatrix,scaleMatrix);
    mat4.multiply(modelMatrix, modelMatrix,rotationMatrix);
    
    gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
    gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
    gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

    gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
    gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
    gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
    gl.uniform1f(s1_AlphaValue_Sphere_Uniform, 1.0);

    gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
    gl.uniform1i(s1_uniform_texture0_sampler, 0);
    
    sphereMesh.draw();
    gl.useProgram(null);
    // winner spher end
    //gl.viewport(0, 0, canvas.width, canvas.height);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(scaleMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    if (showsphere1_flag)
    {
        // looser Sphere1 Start
        gl.useProgram(s1_ShaderProgramObject);

        mat4.translate(translateMatrix, translateMatrix, [sphere1_xpos, sphere1_ypos, -35.0]);
        mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.6, 0.6, 0.6));

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
        gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
        gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

        gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
        gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
        gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
        gl.uniform1f(s1_AlphaValue_Sphere_Uniform, sphere1_blendValue);

        gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
        gl.uniform1i(s1_uniform_texture0_sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        sphereMesh.draw();
        gl.disable(gl.BLEND);
        gl.useProgram(null);
    // looser sphere1 Stop
    }
    
    //gl.viewport(0, 0, canvas.width, canvas.height);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(scaleMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    if (showsphere2_flag)
    {
        // looser Sphere2 Start
        gl.useProgram(s1_ShaderProgramObject);

        mat4.translate(translateMatrix, translateMatrix, [sphere2_xpos, sphere2_ypos, -35.0]);
        mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.6, 0.6, 0.6));

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
        gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
        gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

        gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
        gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
        gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
        gl.uniform1f(s1_AlphaValue_Sphere_Uniform, sphere2_blendValue);

        gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
        gl.uniform1i(s1_uniform_texture0_sampler, 0);

        sphereMesh.draw();
        gl.useProgram(null);
    // looser sphere2 Stop
    }
    //gl.viewport(0, 0, canvas.width, canvas.height);

    // 3
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(scaleMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    if (showsphere3_flag) 
    {
        // looser Sphere1 Start
        gl.useProgram(s1_ShaderProgramObject);

        mat4.translate(translateMatrix, translateMatrix, [sphere3_xpos, sphere3_ypos, -35.0]);
        mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.6, 0.6, 0.6));

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
        gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
        gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

        gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
        gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
        gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
        gl.uniform1f(s1_AlphaValue_Sphere_Uniform, sphere3_blendValue);

        gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
        gl.uniform1i(s1_uniform_texture0_sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        sphereMesh.draw();
        gl.disable(gl.BLEND);
        gl.useProgram(null);
        // looser sphere1 Stop
    }

    //4
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(scaleMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    if (showsphere4_flag) 
    {
        // looser Sphere1 Start
        gl.useProgram(s1_ShaderProgramObject);

        mat4.translate(translateMatrix, translateMatrix, [sphere4_xpos, sphere4_ypos, -35.0]);
        mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.6, 0.6, 0.6));

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
        gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
        gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

        gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
        gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
        gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
        gl.uniform1f(s1_AlphaValue_Sphere_Uniform, sphere4_blendValue);

        gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
        gl.uniform1i(s1_uniform_texture0_sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        sphereMesh.draw();
        gl.disable(gl.BLEND);
        gl.useProgram(null);
        // looser sphere1 Stop
    }

    //5
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(scaleMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    if (showsphere5_flag) 
    {
        // looser Sphere1 Start
        gl.useProgram(s1_ShaderProgramObject);

        mat4.translate(translateMatrix, translateMatrix, [sphere5_xpos, sphere5_ypos, -35.0]);
        mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.6, 0.6, 0.6));

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
        gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
        gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

        gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
        gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
        gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
        gl.uniform1f(s1_AlphaValue_Sphere_Uniform, sphere5_blendValue);

        gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
        gl.uniform1i(s1_uniform_texture0_sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        sphereMesh.draw();
        gl.disable(gl.BLEND);
        gl.useProgram(null);
        // looser sphere1 Stop
    }

    //6
    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(scaleMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    if (showsphere6_flag) {
        // looser Sphere1 Start
        gl.useProgram(s1_ShaderProgramObject);

        mat4.translate(translateMatrix, translateMatrix, [sphere6_xpos, sphere6_ypos, -35.0]);
        mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.6, 0.6, 0.6));

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
        gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
        gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

        gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
        gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
        gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
        gl.uniform1f(s1_AlphaValue_Sphere_Uniform, sphere6_blendValue);

        gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
        gl.uniform1i(s1_uniform_texture0_sampler, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        sphereMesh.draw();
        gl.disable(gl.BLEND);
        gl.useProgram(null);
        // looser sphere1 Stop
    }

}

function treeDisplay()
{
    
    scene2DisplayText();
    sphereDsiplay();

    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotationMatrix = mat4.create();


    // To draw bark
    gl.useProgram(shaderProgramObject_tree);
    mat4.translate(translateMatrix, translateMatrix, [0.0, -15.0, commonTransl]);
    //mat4.translate(translateMatrix, translateMatrix, [0.0, 0.0, transl]);
    //mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot);
    mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot - tree_root_ref_angle);
    //mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot - tree_angle);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

    // Lookat(vec3(position_cam),vec3(looking_at),vec3(up_vector))
    
    gl.uniformMatrix4fv(uniform_ModelMat_tree, false, modelMatrix);
    gl.uniformMatrix4fv(uniform_ViewMat_tree, false, viewMatrix);
    gl.uniformMatrix4fv(uniform_ProjectionMat_tree, false, perspectiveProjectionMatrix);

    // tree
    gl.bindVertexArray(vertexArrayObject_tree);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_tree);
    gl.uniform1f(uniform_AlphaValue_tree, 1.0);
    gl.bindTexture(gl.TEXTURE_2D,texture_bark);
    gl.uniform1i(uniform_texSampler_tree, 0);

    gl.enable(gl.CULL_FACE);//bark
    gl.drawElements(gl.TRIANGLES, pi, gl.UNSIGNED_INT, 0);
    //gl.bindTexture(gl.TEXTURE_2D,null);
    //leaves
    gl.disable(gl.CULL_FACE);
    
    gl.bindTexture(gl.TEXTURE_2D,texture_leaf);
    gl.uniform1i(uniform_texSampler_tree, 0);
    gl.drawElements(gl.TRIANGLES, (pi2 - pi0) * drawLeavesArray[showLeavesIndex], gl.UNSIGNED_INT, 4 * pi0);
    //gl.bindTexture(gl.TEXTURE_2D,null); 

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    // Roots Start
    gl.useProgram(shaderProgramObject_root);
    mat4.translate(translateMatrix, translateMatrix, [0.0, -15.0, commonTransl]);
    mat4.rotateZ(rotationMatrix, rotationMatrix, tree_Z_rot);
    //mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot);
    mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot + tree_root_ref_angle);
    //mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot + tree_angle);

    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

    
    gl.uniformMatrix4fv(uniform_ModelMat_root, false, modelMatrix);
    gl.uniformMatrix4fv(uniform_ViewMat_root, false, viewMatrix);
    gl.uniformMatrix4fv(uniform_ProjectionMat_root, false, perspectiveProjectionMatrix);
    gl.uniform1f(uniform_alphaValue_root,1.0);

    gl.bindVertexArray(vertexArrayObject_root);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_root);

    
    gl.bindTexture(gl.TEXTURE_2D,texture_bark);
    gl.uniform1i(uniform_texSampler_root, 0);
    gl.enable(gl.CULL_FACE);//bark
    gl.drawElements(gl.TRIANGLES, pi_root, gl.UNSIGNED_INT, 0);

    gl.bindVertexArray(null);
    // Roots Stop


    gl.useProgram(null);

    
}


function treeUpdate()
{
    // testing
    tree_angle = tree_angle + 0.005;
    if (tree_angle > 360.0) 
    {
        tree_angle = 0.0;
    }	

    /*  sphere translations start   */

    // 1
    if(global_audio_counter == 3384)
    {
        sphere1_transflag = true;
        sphere2_transflag = true;
    }

    if (sphere1_transflag) 
    {
        // start pos sphere1_xpos 8.0
        // start pos sphere1_ypos 15.0

        // final pos sphere1_xpos 15.0    
        // final pos sphere1_ypos 12.0

        sphere1_xpos = sphere1_xpos + 0.05;
        if (sphere1_xpos > 14.0)
        {
            sphere1_xpos = 14.5;
        }
        sphere1_ypos = sphere1_ypos - 0.05;
        if (sphere1_ypos <= 14.0)
        {
            sphere1_ypos =14.0;
        }

        if ((sphere1_xpos > 14.3) && (sphere1_ypos <= 14.0) )
        {
            sphere1_transflag = false;
            sphere1_blendFlag = true;
        }

    }

    if (sphere1_blendFlag) 
    {
        sphere1_blendValue = sphere1_blendValue - 0.05;
        if (sphere1_blendValue <= 0.0) 
        {
            sphere1_blendValue =0.0;
            sphere1_blendFlag = false;
            showsphere1_flag = false;
            //sphere2_transflag = true;
        }
    }


    // 2
    if (sphere2_transflag) 
    {
        //start pos sphere2_xpos = -12.0;
        //start pos sphere2_ypos = 18.0;

        // final pos sphere2_xpos -19.0
        // final pos sphere2_ypos 12.0

        sphere2_xpos = sphere2_xpos - 0.05;
        if (sphere2_xpos < -13.9)
        {
            sphere2_xpos = -14.0;
        }

        sphere2_ypos = sphere2_ypos - 0.05;
        if (sphere2_ypos <= 14.0)
        {
            sphere2_ypos = 14.0;
        }

        if ((sphere2_xpos <= -13.9) && (sphere2_ypos <= 14))
        {
            sphere2_transflag = false;
            sphere2_blendFlag = true;
        }

        
    }

    if (sphere2_blendFlag) 
    {
        sphere2_blendValue = sphere2_blendValue - 0.05;
        if (sphere2_blendValue <= 0.0) 
        {
            sphere2_blendValue = 0.0;
            sphere2_blendFlag = false;
            showsphere2_flag = false;
        }
    }

    // 3
    if (global_audio_counter == 3640)
    {
        sphere3_transflag = true;
        sphere4_transflag = true;
    }

    if (sphere3_transflag) 
    {
        //start pos sphere3_xpos = -10.0;
        //start pos sphere3_ypos = 18.0;

        // final pos sphere3_xpos -27.0
        // final pos sphere3_ypos 2.0

        sphere3_xpos = sphere3_xpos - 0.05;
        if (sphere3_xpos < -24.9) 
        {
            sphere3_xpos = -25.0;
        }

        sphere3_ypos = sphere3_ypos - 0.05;
        if (sphere3_ypos <= 3.0) 
        {
            sphere3_ypos = 3.0;
        }

        if ((sphere3_xpos <= -24.9) && (sphere3_ypos <= 3.0)) 
        {
            sphere3_transflag = false;
            sphere3_blendFlag = true;
        }


    }

    if (sphere3_blendFlag) 
    {
        sphere3_blendValue = sphere3_blendValue - 0.05;
        if (sphere3_blendValue <= 0.0) 
        {
            sphere3_blendValue = 0.0;
            sphere3_blendFlag = false;
            showsphere3_flag = false;
        }
    }

    // 4
    if (sphere4_transflag) 
    {
        // start pos sphere4_xpos 10.0
        // start pos sphere4_ypos 15.0

        // final pos sphere4_xpos 25.0, 
        // final pos sphere4_ypos 2.0

        sphere4_xpos = sphere4_xpos + 0.05;
        if (sphere4_xpos > 24.9) 
        {
            sphere4_xpos = 25
        }
        sphere4_ypos = sphere4_ypos - 0.05;
        if (sphere4_ypos <= 3.0) 
        {
            sphere4_ypos = 3.0;
        }

        if ((sphere4_xpos > 24.9) && (sphere4_ypos <= 3.0)) {
            sphere4_transflag = false;
            sphere4_blendFlag = true;
        }

    }

    if (sphere4_blendFlag) 
    {
        sphere4_blendValue = sphere4_blendValue - 0.05;
        if (sphere4_blendValue <= 0.0) 
        {
            sphere4_blendValue = 0.0;
            sphere4_blendFlag = false;
            showsphere4_flag = false;
        }
    }


    //5
    if (global_audio_counter == 4000) 
    {
        sphere5_transflag = true;
        sphere6_transflag = true;
    }

    if (sphere5_transflag) 
    {
        //start pos sphere5_xpos = -15.0;
        //start pos sphere5_ypos = 18.0;

        // final pos sphere5_xpos -28.5, -10.0
        // final pos sphere5_ypos -10.0

        sphere5_xpos = sphere5_xpos - 0.05;
        if (sphere5_xpos < -28.3) {
            sphere5_xpos = -28.5;
        }

        sphere5_ypos = sphere5_ypos - 0.05;
        if (sphere5_ypos <= -8.8) 
        {
            sphere5_ypos = -9.0;
        }

        if ((sphere5_xpos <= -28.3) && (sphere5_ypos <= -8.8)) 
        {
            sphere5_transflag = false;
            sphere5_blendFlag = true;
        }


    }

    if (sphere5_blendFlag) 
    {
        sphere5_blendValue = sphere5_blendValue - 0.05;
        if (sphere5_blendValue <= 0.0) 
        {
            sphere5_blendValue = 0.0;
            sphere5_blendFlag = false;
            showsphere5_flag = false;
        }
    }

    // 6
    if (sphere6_transflag) {
        // start pos sphere6_xpos 15.0
        // start pos sphere6_ypos 18.0

        // final pos sphere6_xpos 27.0, 
        // final pos sphere6_ypos -10.0

        sphere6_xpos = sphere6_xpos + 0.05;
        if (sphere6_xpos > 26.9) 
        {
            sphere6_xpos = 27;
        }
        sphere6_ypos = sphere6_ypos - 0.05;
        if (sphere6_ypos <= -9.8) 
        {
            sphere6_ypos = -10.0;
        }

        if ((sphere6_xpos > 26.9) && (sphere6_ypos <= -9.8)) 
        {
            sphere6_transflag = false;
            sphere6_blendFlag = true;
        }

    }

    if (sphere6_blendFlag) 
    {
        sphere6_blendValue = sphere6_blendValue - 0.05;
        if (sphere6_blendValue <= 0.0) 
        {
            sphere6_blendValue = 0.0;
            sphere6_blendFlag = false;
            showsphere6_flag = false;
            winner_sphere_transflag = true;
        }
    }

    if (global_audio_counter == 4700) 
    {
        winner_sphere_transflag = true;
    }
    if (winner_sphere_transflag)
    {
    
        if ((winner_sphere_Ypos > 10.0) && (winner_sphere_Ypos <= 10.05) )
        {
            showLeavesIndex++;
            showLeavesIndex++;
            s2_Phrase_Flag1 = true;

        }

        if (global_audio_counter == 4937) 
        {
            showLeavesIndex++;
            showLeavesIndex++;
            s2_Phrase_Flag2 = true;
        }

        if (global_audio_counter == 5241) 
        {
            showLeavesIndex++;
            showLeavesIndex++;
            s2_Phrase_Flag3 = true;
        }


        /*if ((winner_sphere_Ypos > 0.0) && (winner_sphere_Ypos <= 0.05)) 
        {
            showLeavesIndex++;
            //s2_Phrase_Flag3 = true;
        }

        if ((winner_sphere_Ypos < -7.25) && (winner_sphere_Ypos > -7.30)) {
            //showLeavesIndex++;
            //s2_Phrase_Flag3 = true;
        }*/


        
        winner_sphere_Ypos = winner_sphere_Ypos - 0.035;
        if (winner_sphere_Ypos < -10.850)
        {
            winner_sphere_Ypos = -10.850;
            showLeavesIndex++;
            s2_Phrase_Flag3 = true;
            winner_sphere_transflag = false;
        }

    }
    /*  sphere translations start   */


    /*  Phrase calculations start */
    if (s2_Phrase_Flag1)
    {
        s2_Phrase_value1 = s2_Phrase_value1 - 0.05;
        if (s2_Phrase_value1 <= 0.0)
        {
            s2_Phrase_value1 = 0.0;
            s2_Phrase_Flag1 = false;
        }
    }


    if (s2_Phrase_Flag2) 
    {
        s2_Phrase_value2 = s2_Phrase_value2 - 0.05;
        if (s2_Phrase_value2 <= 0.0) 
        {
            s2_Phrase_value2 = 0.0;
        }
    }

    if (s2_Phrase_Flag3) {
        s2_Phrase_value3 = s2_Phrase_value3 - 0.05;
        if (s2_Phrase_value3 <= 0.0) 
        {
            s2_Phrase_value3 = 0.0;
            s2_Phrase_Flag3 = false;
        }
    }

    /*  Phrase calculations stop  */

}

function scene2TreeUpdateLookAt()
{
    // handeling lookat varibales
    /*
    Init => x=0, y=0, z=0
    Final => x = 0,y= -10.85,z = -35
     */

    if (s2_lookatflag) 
    {
        tree_y_posn = tree_y_posn - 0.04;
        if (tree_y_posn <= -10.5) 
        {
            tree_y_posn = -10.5;
        }

        tree_z_posn = tree_z_posn - 0.04;
        if (tree_z_posn <= -23.45) 
        {
            tree_z_posn = -23.45;
            s2_lookatflag = false;
            
        }
    }

    if (global_audio_counter == 5854)
    {
        showCourceFont = true;
    }

    if ((global_audio_counter >= 6000) && (global_audio_counter <= 6218))
    {
        sc2_LA_Sphere_Ypos = sc2_LA_Sphere_Ypos - 0.03;
        if (sc2_LA_Sphere_Ypos < -20.0)
        {
            sc2_LA_Sphere_Ypos = -20.0;
        }

    }

    if (global_audio_counter == 6218)
    {
        showCourceFont = false;
        s2_BlackOutFlag = true;
    }

    if (s2_BlackOutFlag)
    {
        s2_BlackOutVariable = s2_BlackOutVariable - 0.03;
        if (s2_BlackOutVariable <= 0.0)
        {
            s2_BlackOutVariable = 0.0;
            s2_BlackOutFlag = false;
        }
    }

    if (global_audio_counter == 6460)
    {
        bHelicalLookAt = true;
    }

    /*if (global_audio_counter >= 8327)
    {
        helicalTree_alphaValue = helicalTree_alphaValue - 0.005;
        if (helicalTree_alphaValue < 0.0) 
        {
            helicalTree_alphaValue = 0.0;
            bHelicalLookAt = false;
        }
    }*/

    if(bHelicalLookAt)
    {
        animate = animate + 1.0;
        if((animate%6)==0)
        {
            index = index + 3;
            if (index >= 933)
            {
                index = 933;
                if (global_audio_counter >= 8527) 
                {
                    helicalTree_alphaValue = helicalTree_alphaValue - 0.03;
                    if (helicalTree_alphaValue < 0.1) 
                    {
                        helicalTree_alphaValue = 0.0;
                        bHelicalLookAt = false;
                    }
                }
                //bHelicalLookAt = false;
            }
        }
    }

        

}

function treeUnitialize()
{

    if (vertexArrayObject_tree) {
        gl.deleteVertexArray(vertexArrayObject_tree);
        vertexArrayObject = null;
    }

    if (vertexBufferObject_tree) {
        gl.deleteBuffer(vertexBufferObject_tree);
        vertexBufferObject_tree = null;
    }

    if (vertexBufferObject_Elements_tree) {
        gl.deleteBuffer(vertexBufferObject_Elements_tree);
        vertexBufferObject_Elements_tree = null;
    }

    if (vertexArrayObject_root) {
        gl.deleteVertexArray(vertexArrayObject_root);
        vertexArrayObject_root = null;
    }

    if (vertexBufferObject_root) {
        gl.deleteBuffer(vertexBufferObject_root);
        vertexBufferObject_root = null;
    }

    if (vertexBufferObject_Elements_root) {
        gl.deleteBuffer(vertexBufferObject_Elements_root);
        vertexBufferObject_Elements_root = null;
    }

    if (shaderProgramObject_tree) {
        if (fragmentShaderObject_tree) {
            gl.detachShader(shaderProgramObject_tree, fragmentShaderObject_tree);
            gl.deleteShader(fragmentShaderObject_tree);
            fragmentShaderObject_tree = null;
        }

        if (vertexShaderObject_tree) {
            gl.detachShader(shaderProgramObject_tree, vertexShaderObject_tree);
            gl.deleteShader(vertexShaderObject_tree);
            vertexShaderObject_tree = null;
        }

        gl.deleteProgram(shaderProgramObject_tree);
        shaderProgramObject_tree = null;
    }
}

function scene2TextUnintialize()
{
    for (var i = 0; i < s2_Phrases.length ; i++)
    {
        gl.deleteTexture(s2_PhrasesTexture[i]);
        s2_PhrasesTexture[i]=null;
    }
}
//

function scene2treeDisplayWithLookAt()
{

    if(bHelicalLookAt == true)
    {
        var modelMatrix = mat4.create();
        var viewMatrix = mat4.create();
        var translateMatrix = mat4.create();
        var rotationMatrix = mat4.create();


        // To draw bark
        gl.useProgram(shaderProgramObject_tree);
        mat4.translate(translateMatrix, translateMatrix, [0.0, -14.0, 0.0]);
        mat4.rotateZ(rotationMatrix, rotationMatrix, Math.PI);

        mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot - tree_root_ref_angle);
        //mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot - tree_angle);
        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        mat4.lookAt(viewMatrix, [30.0 * helixVertices[index], 10.0* helixVertices[index+1], 30.0 * helixVertices[index+2]], [0.0, 10.0 * helixVertices[index + 1], 0.0], [0.0, 1.0, 0.0]);

        gl.uniformMatrix4fv(uniform_ModelMat_tree, false, modelMatrix);
        gl.uniformMatrix4fv(uniform_ViewMat_tree, false, viewMatrix);
        gl.uniformMatrix4fv(uniform_ProjectionMat_tree, false, perspectiveProjectionMatrix);

        // tree
        gl.bindVertexArray(vertexArrayObject_tree);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_tree);
        //gl.uniform1f(uniform_AlphaValue_tree, 1.0);// Sam : Updated at 16-Feb-2020
        gl.uniform1f(uniform_AlphaValue_tree, helicalTree_alphaValue);
        gl.bindTexture(gl.TEXTURE_2D, texture_bark);
        gl.uniform1i(uniform_texSampler_tree, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.CULL_FACE);//bark
        gl.drawElements(gl.TRIANGLES, pi, gl.UNSIGNED_INT, 0);
        //gl.bindTexture(gl.TEXTURE_2D,null);
        //leaves
        gl.disable(gl.CULL_FACE);
        

        gl.bindTexture(gl.TEXTURE_2D, texture_leaf);
        gl.uniform1i(uniform_texSampler_tree, 0);
        gl.drawElements(gl.TRIANGLES, (pi2 - pi0), gl.UNSIGNED_INT, 4 * pi0);
        //gl.bindTexture(gl.TEXTURE_2D,null); 

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        gl.disable(gl.BLEND);
        gl.useProgram(null);


        mat4.identity(modelMatrix);
        mat4.identity(viewMatrix);
        mat4.identity(translateMatrix);
        mat4.identity(rotationMatrix);

        // Roots Start
        gl.useProgram(shaderProgramObject_root);
        mat4.rotateZ(rotationMatrix, rotationMatrix, Math.PI);
        mat4.rotateZ(rotationMatrix, rotationMatrix, tree_Z_rot);
        mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot + tree_root_ref_angle);
        mat4.translate(translateMatrix, translateMatrix, [0.0, -14.0, 0.0]);

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        mat4.lookAt(viewMatrix, [30.0 * helixVertices[index], 10.0* helixVertices[index+1], 30.0 * helixVertices[index+2]], [0.0, 10.0 * helixVertices[index + 1], 0.0], [0.0, 1.0, 0.0]);

        gl.uniformMatrix4fv(uniform_ModelMat_root, false, modelMatrix);
        gl.uniformMatrix4fv(uniform_ViewMat_root, false, viewMatrix);
        gl.uniformMatrix4fv(uniform_ProjectionMat_root, false, perspectiveProjectionMatrix);
        gl.uniform1f(uniform_alphaValue_root, helicalTree_alphaValue);

        gl.bindVertexArray(vertexArrayObject_root);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_root);


        gl.bindTexture(gl.TEXTURE_2D, texture_bark);
        gl.uniform1i(uniform_texSampler_root, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.CULL_FACE);//bark
        gl.drawElements(gl.TRIANGLES, pi_root, gl.UNSIGNED_INT, 0);

        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        gl.bindVertexArray(null);
        // Roots Stop


        gl.useProgram(null);
    }
    else
    {
        if (showCourceFont) {
            scene2CourseDisplay();
        }

        scene2SphereDsiplayWithLookat();

        var modelMatrix = mat4.create();
        var viewMatrix = mat4.create();
        var translateMatrix = mat4.create();
        var rotationMatrix = mat4.create();


        // To draw bark
        gl.useProgram(shaderProgramObject_tree);
        mat4.translate(translateMatrix, translateMatrix, [0.0, -15.0, commonTransl]);
        //mat4.translate(translateMatrix, translateMatrix, [0.0, 0.0, transl]);
        //mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot);
        mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot - tree_root_ref_angle);
        //mat4.rotateY(rotationMatrix, rotationMatrix, tree_Y_rot - tree_angle);
        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        // Lookat(vec3(position_cam),vec3(looking_at),vec3(up_vector))
        mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);

        gl.uniformMatrix4fv(uniform_ModelMat_tree, false, modelMatrix);
        gl.uniformMatrix4fv(uniform_ViewMat_tree, false, viewMatrix);
        gl.uniformMatrix4fv(uniform_ProjectionMat_tree, false, perspectiveProjectionMatrix);

        // tree
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.bindVertexArray(vertexArrayObject_tree);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_tree);

        gl.uniform1f(uniform_AlphaValue_tree, s2_BlackOutVariable);
        gl.bindTexture(gl.TEXTURE_2D, texture_bark);
        gl.uniform1i(uniform_texSampler_tree, 0);

        gl.enable(gl.CULL_FACE);//bark
        gl.drawElements(gl.TRIANGLES, pi, gl.UNSIGNED_INT, 0);
        //gl.bindTexture(gl.TEXTURE_2D,null);
        //leaves
        gl.disable(gl.CULL_FACE);

        gl.bindTexture(gl.TEXTURE_2D, texture_leaf);
        gl.uniform1i(uniform_texSampler_tree, 0);
        gl.drawElements(gl.TRIANGLES, (pi2 - pi0) * drawLeavesArray[showLeavesIndex], gl.UNSIGNED_INT, 4 * pi0);
        //gl.bindTexture(gl.TEXTURE_2D,null); 

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        gl.disable(gl.BLEND);

        gl.useProgram(null);

        mat4.identity(modelMatrix);
        mat4.identity(viewMatrix);
        mat4.identity(translateMatrix);
        mat4.identity(rotationMatrix);

        // Roots Start
        gl.useProgram(shaderProgramObject_root);
        mat4.translate(translateMatrix, translateMatrix, [0.0, -15.0, commonTransl]);
        mat4.rotateZ(rotationMatrix, rotationMatrix, tree_Z_rot);
        //mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot);
        mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot + tree_root_ref_angle);
        //mat4.rotateY(rotationMatrix, rotationMatrix, root_Y_rot + tree_angle);

        mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
        gl.uniformMatrix4fv(uniform_ModelMat_root, false, modelMatrix);
        gl.uniformMatrix4fv(uniform_ViewMat_root, false, viewMatrix);
        gl.uniformMatrix4fv(uniform_ProjectionMat_root, false, perspectiveProjectionMatrix);
        gl.uniform1f(uniform_alphaValue_root, s2_BlackOutVariable);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.bindVertexArray(vertexArrayObject_root);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBufferObject_Elements_root);


        gl.bindTexture(gl.TEXTURE_2D, texture_bark);
        gl.uniform1i(uniform_texSampler_root, 0);
        gl.enable(gl.CULL_FACE);//bark
        gl.drawElements(gl.TRIANGLES, pi_root, gl.UNSIGNED_INT, 0);

        gl.bindVertexArray(null);
        gl.disable(gl.BLEND);
        // Roots Stop


        gl.useProgram(null);
    }
    
}

function scene2SphereDsiplayWithLookat()
{
    var translateMatrix = mat4.create();
    var scaleMatrix = mat4.create();
    var rotationMatrix = mat4.create();
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();

    // Winner Sphere
    gl.useProgram(s1_ShaderProgramObject);

    mat4.translate(translateMatrix, translateMatrix, [0.0, sc2_LA_Sphere_Ypos, -33.0]);
    mat4.rotateX(rotationMatrix, rotationMatrix, s1_Sphere_Angle);
    mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.25, 0.25, 0.25));

    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    mat4.multiply(modelMatrix, modelMatrix, scaleMatrix);
    mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(s1_ModelMatrix_Uniform, false, modelMatrix);
    gl.uniformMatrix4fv(s1_ViewMatrix_Uniform, false, viewMatrix);
    gl.uniformMatrix4fv(s1_ProjectionMatrix_Uniform, false, perspectiveProjectionMatrix);

    gl.uniform3f(s1_la_Uniform, 0.2, 0.2, 0.2);
    gl.uniform3f(s1_ld_Uniform, 1.0, 1.0, 1.0);
    gl.uniform3f(s1_kd_Uniform, .5, .5, .5);
    gl.uniform1f(s1_AlphaValue_Sphere_Uniform, 1.0);

    gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
    gl.uniform1i(s1_uniform_texture0_sampler, 0);

    sphereMesh.draw();
    gl.useProgram(null);

}


function scene2CourseDisplay()
{
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotationMatrix = mat4.create();

    /*"Fundamentals","Win32","COM","WinRT","RTR","UNIX" */
    // 0 : Fundamentals
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-3.0, -10.85, -30.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);

    gl.bindTexture(gl.TEXTURE_2D, s2_LACourseTexture[0]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, 0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    // 1 : Win32
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [3.0, -10.85, -30.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);

    gl.bindTexture(gl.TEXTURE_2D, s2_LACourseTexture[1]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, 0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);


    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    // 2 : COM
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-3.0, -11.85, -30.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);

    gl.bindTexture(gl.TEXTURE_2D, s2_LACourseTexture[2]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, 0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);


    // 3 : WinRT
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [3.0, -11.85, -30.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);

    gl.bindTexture(gl.TEXTURE_2D, s2_LACourseTexture[3]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, 0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    // 4 : RTR
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [3.0, -12.85, -30.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);

    gl.bindTexture(gl.TEXTURE_2D, s2_LACourseTexture[4]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, 0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);


    // 5 : RTR
    gl.useProgram(text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-3.0, -12.85, -30.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);

    mat4.lookAt(viewMatrix, [tree_x_posn, tree_y_posn, tree_z_posn], [0.0, -10.85, -35.0], [0.0, 1.0, 0.0]);
    gl.uniformMatrix4fv(text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);

    gl.bindTexture(gl.TEXTURE_2D, s2_LACourseTexture[5]);
    gl.uniform1i(text_uniform_texture0_sampler, 0);
    gl.uniform1f(text_uniform_AlphaValue, 0.9);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);
}
