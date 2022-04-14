function tokenToCookie(res, data) {
    /*  console.log(data); */
    if (data.success) {
        let date = new Date(new Date().setDate(new Date().getDate() + 7));
        return res
            .cookie("token", data.token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                expires: date,
            })
            .json({ success: data.success, user: data.data });
        /* .redirect("http://localhost:3000") */
    }

    return res.status(401).json(data);
}

module.exports = tokenToCookie;
