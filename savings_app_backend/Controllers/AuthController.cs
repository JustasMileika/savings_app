﻿using Application.Services.Interfaces;
using Domain.DTOs.Request;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace savings_app_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserLoginDTO userLogin)
        {
            return Ok(await _authService.Login(userLogin));
        }
    }
}
