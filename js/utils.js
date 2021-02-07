//generating christoffel symbols
function generateChristoffel(g, g_inv) {
    var L = math.zeros(dn, dn, dn)._data
    for (var nu = 0; nu < dn; nu++) {
        for (var i = 0; i < dn; i++) {
            for (var j = 0; j < dn; j++) {
                
                for (var m = 0; m < dn; m++) {
                    sum_der = math.string(math.derivative(g[j][m], coordinates_names[i])) + "+" + math.string(math.derivative(g[m][i], coordinates_names[j])) + "-" + math.string(math.derivative(g[i][j], coordinates_names[m]))
                    L[nu][i][j] += "+(1/2*" + g_inv[nu][m] + "*(" + sum_der + "))";
                }

                L[nu][i][j] = math.string(math.simplify(L[nu][i][j]))
            }
        }
    }
    return L;
}

//inverting matrix
function invertMatrix(M) {
    if (M.length !== M[0].length) { return; }
    var i = 0, ii = 0, j = 0, dim = M.length, e = 0, t = 0;
    var I = [], C = [];
    for (i = 0; i < dim; i += 1) {
        I[I.length] = [];
        C[C.length] = [];
        for (j = 0; j < dim; j += 1) {
            if (i == j) { I[i][j] = "1"; }
            else { I[i][j] = "0"; }
            C[i][j] = M[i][j];
        }
    }
    for (i = 0; i < dim; i += 1) {
        e = C[i][i];
        if (e == 0) {
            for (ii = i + 1; ii < dim; ii += 1) {
                if (C[ii][i] != 0) {
                    for (j = 0; j < dim; j++) {
                        e = C[i][j];       
                        C[i][j] = C[ii][j];
                        C[ii][j] = e;      
                        e = I[i][j];       
                        I[i][j] = I[ii][j];
                        I[ii][j] = e;
                    }
                    break;
                }
            }
            e = C[i][i];
            if (e == 0) { return }
        }
        for (j = 0; j < dim; j++) {
            C[i][j] = "" + C[i][j] + "/" + "(" + e + ")";
            I[i][j] = "" + I[i][j] + "/" + "(" + e + ")";
        }
        for (ii = 0; ii < dim; ii++) {
            if (ii == i) { continue; }
            e = C[ii][i];
            for (j = 0; j < dim; j++) {
                C[ii][j] = "(" + C[ii][j] + "-(" + e + ")*" + C[i][j] + ")";
                I[ii][j] = "(" + I[ii][j] + "-(" + e + ")*" + I[i][j] + ")";
            }
        }
    }
    for (var i = 0; i < dim; i++) {
        for (var j = 0; j < dim; j++) {
            I[i][j] = math.string(math.simplify(I[i][j]))
        }
    }
    return I;
}