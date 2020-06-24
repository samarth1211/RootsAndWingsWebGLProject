var starting_credits_PhrasesTexture=[];
var starting_credits_Phrases = ["DomainShader Group Presenting...", "ROOTS & WINGS", "Controls :", "'Space bar' to start","'f/F' for fullscreen"];

var starting_credits_Phrase_Flag1 = false;
var starting_credits_Phrase_Flag2 =false;

var starting_credits_Phrase_value1 = 1.0;
var starting_credits_Phrase_value2 = 1.0;

// init for title
function title_init()
{
     // make texture for phrases
     starting_credits_PhrasesTexture = title_createTextTexture(starting_credits_Phrases, 5200, 300, "red");
}

function titleDisplayText()
{
    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotationMatrix = mat4.create();

    //0 : Domain Group Presenting...
    gl.useProgram(title_text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [-6.5, 6.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, starting_credits_PhrasesTexture[0]);
    gl.uniform1i(title_text_uniform_texture0_sampler, 0);
    gl.uniform1f(title_text_uniform_AlphaValue,0.5);
    gl.uniform3f(title_text_uniform_ColorValue,0.5, 0.20, 0.70);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(title_text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    //1 : ROOTS & WINGS
    gl.useProgram(title_text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [0.0, -0.0, -12.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, starting_credits_PhrasesTexture[1]);
    gl.uniform1i(title_text_uniform_texture0_sampler, 0);
    gl.uniform1f(title_text_uniform_AlphaValue,0.5);
    gl.uniform3f(title_text_uniform_ColorValue,0.5, 0.20, 0.70);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(title_text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);


    //2:  Controls
    gl.useProgram(title_text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [6.5, -6.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, starting_credits_PhrasesTexture[2]);
    gl.uniform1i(title_text_uniform_texture0_sampler, 0);
    gl.uniform1f(title_text_uniform_AlphaValue,0.5);
    gl.uniform3f(title_text_uniform_ColorValue,0.5, 0.20, 0.70);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(title_text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);


    //3: spacebar
    gl.useProgram(title_text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [10.0, -8.5, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, starting_credits_PhrasesTexture[3]);
    gl.uniform1i(title_text_uniform_texture0_sampler, 0);
    gl.uniform1f(title_text_uniform_AlphaValue,0.5);
    gl.uniform3f(title_text_uniform_ColorValue,0.5, 0.20, 0.70);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(title_text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    // 4:fullscreen
    gl.useProgram(title_text_ShaderProgramObject);
    mat4.translate(translateMatrix, translateMatrix, [9.5, -11.0, -35.0]);
    mat4.multiply(modelMatrix, modelMatrix, translateMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(title_text_uniform_ProjectionMatrix, false, perspectiveProjectionMatrix);
    gl.bindTexture(gl.TEXTURE_2D, starting_credits_PhrasesTexture[4]);
    gl.uniform1i(title_text_uniform_texture0_sampler, 0);
    gl.uniform1f(title_text_uniform_AlphaValue,0.5);
    gl.uniform3f(title_text_uniform_ColorValue,0.5, 0.20, 0.70);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(title_text_vertexArrayObject_Square);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.useProgram(null);

    

}
