'use strict';

function ColorCube() {
    this.mesh =  {
        vertices: [
/*
            0xbf800000, 0x3f800000, 0x3f800000, 0xff000000,
            0x3f800000, 0x3f800000, 0x3f800000, 0xff0000ff,
            0xbf800000, 0xbf800000, 0x3f800000, 0xff00ff00,
            0x3f800000, 0xbf800000, 0x3f800000, 0xff00ffff,
            0xbf800000, 0x3f800000, 0xbf800000, 0xffff0000,
            0x3f800000, 0x3f800000, 0xbf800000, 0xffff00ff,
            0xbf800000, 0xbf800000, 0xbf800000, 0xffffff00,
            0x3f800000, 0xbf800000, 0xbf800000, 0xffffffff,
*/
            0xbe800000, 0x3e800000, 0x3e800000, 0xff000000,
            0x3e800000, 0x3e800000, 0x3e800000, 0xff0000ff,
            0xbe800000, 0xbe800000, 0x3e800000, 0xff00ff00,
            0x3e800000, 0xbe800000, 0x3e800000, 0xff00ffff,
            0xbe800000, 0x3e800000, 0xbe800000, 0xffff0000,
            0x3e800000, 0x3e800000, 0xbe800000, 0xffff00ff,
            0xbe800000, 0xbe800000, 0xbe800000, 0xffffff00,
            0x3e800000, 0xbe800000, 0xbe800000, 0xffffffff,
        ],

        indices: [
            0, 1, 2, // 0
	    1, 3, 2,
	    4, 6, 5, // 2
	    5, 6, 7,
	    0, 2, 4, // 4
	    4, 2, 6,
	    1, 5, 3, // 6
	    5, 7, 3,
	    0, 4, 1, // 8
	    4, 5, 1,
	    2, 3, 6, // 10
	    6, 3, 7,
        ]
    };

    this.programLoaded  = function(program) {
        program.attribs = {};
        var attribs = [ 'pos', 'nml', 'col0' ];
        for (var a in attribs) {
            var attr = attribs[a];
            program.attribs[attr] = gl.getAttribLocation(program, 'a_' + attr);
        }

        program.uniforms = {}
        var uniforms = [ 'model', 'view', 'proj' ];
        for (var u in uniforms) {
            var uniform = uniforms[u];
            program.uniforms[uniform] = gl.getUniformLocation(program, 'u_' + uniform);
        }

        this.program = program;
    }

    this.init = function() {
        // vertices
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(this.mesh.vertices), gl.STATIC_DRAW);

        // indices
        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), gl.STATIC_DRAW);

        var that = this;
        var prog = loadProgram('shaders/vs-simple-color.txt', 'shaders/fs-simple-color.txt',
                                   function(prog) { that.programLoaded(prog); });
        prog.numIndices = this.mesh.indices.length;
    }

    this.setUniforms = function(flags) {
        var program = this.program;
        if (this.program) {
            if (flags & 0x1) gl.uniformMatrix4fv(program.uniforms.model, false, modelMatrix().d);
            if (flags & 0x2) gl.uniformMatrix4fv(program.uniforms.proj, false, projMatrix().d);
            if (flags & 0x4) gl.uniformMatrix4fv(program.uniforms.view, false, viewMatrix().d);
        }
    }

    this.bind = function() {
        if (this.program) {
            var program = this.program;

            gl.useProgram(program);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

            gl.enableVertexAttribArray(program.attribs.pos);
            gl.vertexAttribPointer(program.attribs.pos, 3, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(program.attribs.col0);
            gl.vertexAttribPointer(program.attribs.col0, 4, gl.UNSIGNED_BYTE, true, 16, 12);
        }
    }

    this.draw = function(flags) {
        if (this.program) {
            var program = this.program;

            this.setUniforms(flags);

            gl.drawElements(gl.TRIANGLES, program.numIndices, gl.UNSIGNED_SHORT, 0);
        }
    }

    this.init();
}
